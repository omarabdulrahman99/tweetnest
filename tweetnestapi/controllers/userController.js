const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const needle = require("needle");
const aws = require('@aws-sdk/client-s3');
const presigner = require('@aws-sdk/s3-request-presigner');
const User = require("../models/userModel");
const constants = require('./constants');
const util = require('../util');
const s3 = new aws.S3Client({
	credentials: {
		accessKeyId: process.env.ACCESS_KEY,
		secretAccessKey: process.env.SECRET_ACCESS_KEY,
	},
	region: process.env.BUCKET_REGION,
});

const registerUser = asyncHandler(async(req, res) => {
	const { email, password, display_name } = req.body;
	if(!email || !password || !display_name){
		res.status(400);
		throw new Error('All fields are mandatory!');
	}
	const userAvailable = await User.findOne({ email });
	if (userAvailable) {
		res.status(400);
		throw new Error("User already registered");
	}
	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await User.create({
		email,
		password: hashedPassword,
		display_name,
	})
	if(user){
		res.status(201).json({ _id: user._id, email: user.email });
	} else {
		res.status(400);
		throw new Error('User data is not valid');
	}
	res.json({ message: 'Register the user'});
});

const loginUser = asyncHandler(async(req, res) => {
	console.log('loggedin');
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(400);
		throw new Error('All fields are mandatory!');
	}
	const user = await User.findOne({ email });
	if (!user) {
		res.status(401);
		throw new Error('User does not exist.');
	}
	if(await bcrypt.compare(password, user.password)){
		const accessToken = jwt.sign({
			user,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: "1440m" }
		);
		res.status(200).json({ accessToken, cookieExpire: 86400000 });
	} else {
		res.status(401);
		throw new Error("Password is not valid");
	}

});

const addMedia = asyncHandler(async(req, res) => {
	const { media_type, media_name } = req.body;
	let setMediaId = null;
	// need to retrive puuid from summoner name and add that. media_name for display name to sort by purposes.
	switch(media_type) {
		case 'league':
			const mediauserinfo = await needle('get', `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${media_name}`, {}, {
				headers: {
					"X-Riot-Token": process.env.RIOT_TOKEN
				}
			});
			setMediaId = mediauserinfo.body.puuid;
			break;
	}
	if(!setMediaId) {
		res.status(400);
		throw new Error('User does not exist');
	}

	const user = await User.findById(req.user._id);//find by user id solely, then filter for existing media_id.
	const checkMediaType = user.media[media_type];
	const checkMediaId = checkMediaType && !user.media[media_type].values.find((elem) => elem.media_id === setMediaId);
	if (user && checkMediaId) {
		/**
		user.media[media_type].values.push({ media_id, date_added: Date.now(), clicks:0 });
		await user.save();
		**/
		const templateString = `media.${media_type}.values`;
		const user = await User.findOneAndUpdate({ _id: req.user._id }, { "$push": { [templateString]: { media_id: setMediaId, media_name, date_added: Date.now(), clicks:0 } } });
		const usercheck = await User.findById(req.user._id);
		res.status(200).json({ user: usercheck });
	} else {
		if (!checkMediaType) {
			res.status(400);
			throw new Error('Media type nonexistent');
		}
		if (!checkMediaId) {
			res.status(400);
			throw new Error('Media id already exists');
		}
	}
})

const updateClicks = asyncHandler(async(req, res) => {
	const { media_type, media_id, clickType } = req.body;
	const queryMediaField = `media.${media_type}.media_id`;
	const clickField = `media.${media_type}.$.clicks`;
	try {
	  const userawait = await User.findOneAndUpdate(
      { _id: req.user._id, [queryMediaField]: media_id },
      { $inc: { [clickField]: clickType === 'add' ? 1 : -1} },
	  );
		const usercheck = await User.findById(req.user._id);
		res.status(200).json({ user: usercheck });
	} catch(err) {
		res.status(400);
		throw new Error(err);
	}
})

const deleteMedia = asyncHandler(async(req, res) => {
	const { media_id, media_type } = req.body;
	const queryMedia = `media.${media_type}.values`;
	console.log(media_id);
	try {
	  const userawait = await User.findOneAndUpdate(
      { _id: req.user._id },
      {$pull: {[queryMedia]: {media_id: media_id}}},
	  );
		const afteruser = await User.findById(req.user._id);
		const mediaExists = afteruser.media[media_type].values.find(media => media_id === media.media_id);
		console.log(mediaExists);
		if (!mediaExists) {
			res.status(200).json({ message: 'successfully deleted' });
		} else {
			res.status(400);
			throw new Error({ message: 'Was not deleted'})			
		}
	} catch(err) {
		res.status(400);
		throw new Error(err)
	}
})


// need to retrieve media ids and media post ids to load posts. 
// need to retrieve array of media post ids as well, to show the notifications '5 new posts' on page load. Let's limit
// to 5 profiles maximum due to api limits.

const getMediaDetails = asyncHandler(async(req, res) => {
	// req.query.media_type, req.query.sortBy, req.query.sortOrder
	// after use clicks on a media id profile, and onloadmenu with it's loaded lists, call api to store date of last post in the 
	// list in user's profile as 'lastCheckDate' using LoL 'gameEndTimestamp'. Use this lastCheckDate for the next set of <10 
	// notifications.

	const user = await User.findById(req.user._id); //returns one object, not an array
	switch(req.query.media_type) {
	case 'league':
		const detailarray = [];
		//get account info to return and dispaly on ui per puuid, since 'name' changes if user changes it.
		for(let i = 0; i < user.media[req.query.media_type].values.length; i++) {
			detailarray.push({
				lastcheckdate: user.media.league.lastcheckdate,
				date_added: user.media.league.values[i].date_added,
				clicks: user.media.league.values[i].clicks,
				mediauserinfo: () => needle('get', `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${user.media[req.query.media_type].values[i].media_id}`, {}, {
				headers: {
					"X-Riot-Token": process.env.RIOT_TOKEN
				}
			})
		});
		}
  	const results = await Promise.all(detailarray.map(c => c.mediauserinfo().then(t => {
	  		 c.mediauserinfo = { ...t.body, lastcheckdate: c.lastcheckdate };
	  	}
	  	)));
  	// get profile icon from s3 presigned url for each media_id/puuid  profileIconId
  	for(let i = 0; i < detailarray.length; i++) {
  		detailarray[i].mediauserinfo.profilelink = async () => {
  			const command = new aws.GetObjectCommand({ Bucket: 'tweetnest', Key:`profileicon/${detailarray[i].mediauserinfo.profileIconId}.png`});
				const url = await presigner.getSignedUrl(s3, command, { expiresIn: 3600 });
				return url;
  		}
  	}
  	const results2 = await Promise.all(detailarray.map(c => c.mediauserinfo.profilelink().then(t => {
	  		c.mediauserinfo.profilelink = t;
	  	})));
		// get match ids for puuid.
  	for(let i = 0; i < detailarray.length; i++) {
  		detailarray[i].matchinfo = () => needle('get', `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${detailarray[i].mediauserinfo.puuid}/ids?start=0&count=5`, {}, {
				headers: {
					"X-Riot-Token": process.env.RIOT_TOKEN
				}
			})
  	}
  	const results3 = await Promise.all(detailarray.map(c => c.matchinfo().then(t => {
	  		c.matchinfo = t.body.slice(0, 5);
	  	})));
		// get matchinfo per matchid
		for(let i = 0; i < detailarray.length; i++) {
			for(let j = 0; j < detailarray[i].matchinfo.length; j++) {
				const matchid = detailarray[i].matchinfo[j];
				detailarray[i].matchinfo[j] = (() => needle('get', constants.media_types('league', matchid), {}, {
					headers: {
						"X-Riot-Token": process.env.RIOT_TOKEN
					}
				})
				);
		}}
		/**
  	const results4 = 
	  		await Promise.all(detailarray.map((da, index) => {
	  			return Promise.resolve().then(() => {
				  	return Promise.all(da.matchinfo.map((c, index2) => c().then(t => {
				  		detailarray[index].matchinfo[index2] = constants.detailsreturn('league', t.body.info);
				  	}
				  	)));
	  			})
	  		})); **/
		const results4promises = [];
  	const results4 = 
	  		detailarray.map((da, index) => {
				  	return da.matchinfo.map((c, index2) => {
				  		results4promises.push(function cpromise() {
					  		return c().then(t => {
					  			detailarray[index].matchinfo[index2] = constants.detailsreturn('league', t.body.info);
					  		})
				  		})
				  	}
				  );
	  		});
		const batchescall = await util.promiseBatchWithTime(results4promises);
    // sort by detailarray[0].mediauserinfo.name, or mediauserinfo.clicks or mediauserinfo.date_added or most
  	// notifications(detailarray[0].matchinfo.length)
  		const sortedresults = detailarray.sort((a, b) => {
  			if (req.query.sortOrder === 'asc') {
					if (req.query.sortBy === 'notifcount') {
						return a.matchinfo.length - b.matchinfo.length
					} else {
						return typeof(a.mediauserinfo[req.query.sortBy]) === 'string' ? 
							a.mediauserinfo[req.query.sortBy].localeCompare(b.mediauserinfo[req.query.sortBy]) :
							a.mediauserinfo[req.query.sortBy] - b.mediauserinfo[req.query.sortBy];
					}
			  } else {
					if (req.query.sortBy === 'notifcount') {
						return b.matchinfo.length - a.matchinfo.length
					} else {
						return typeof(b.mediauserinfo[req.query.sortBy]) === 'string' ? 
							b.mediauserinfo[req.query.sortBy].localeCompare(a.mediauserinfo[req.query.sortBy]) :
							b.mediauserinfo[req.query.sortBy] - a.mediauserinfo[req.query.sortBy];
					}
			  }
  		});
  	// set 'notification count', loop through each media, and match, and check if it's after start of today to count towards notif #.
		const todayStartDate = new Date();
		todayStartDate.setHours(0,0,0,0);
		for(let i = 0; i < detailarray.length; i++) {
			detailarray[i].notifCount = 0;
			for(let j = 0; j < detailarray[i].matchinfo.length; j++) {
				if(detailarray[i].matchinfo[j].gameStart >= todayStartDate) {
					detailarray[i].notifCount += 1;
				}
			}
		}
  		res.status(201).json(detailarray)
		break;
	case 'instagram':
		break;
	default:
		return res.status(201).json([])
	}
})


//upload own user profile image profile page


// api for save lastCheckDate store.
const updateLastCheckDate = asyncHandler(async(req, res) => {
	const user = await User.findOneAndUpdate({ _id: req.user._id }, { lastcheckdate: req.body.lastcheckdate });
	res.status(201).json({ lastcheckdate: user.lastcheckdate });
})

//get count for each media_id in list in array to display ui graph.
const getMediaGraphCounts = asyncHandler(async(req, res) => {
	const allusers = await User.find();
	const allusersn = [...allusers];
	const mediaccounts = [];
	allusersn.forEach(curr => {
	  curr.media[req.query.media_type].forEach(mo => {
	  	let find = mediaccounts.find(f => f[mo.media_id]);
	  	if (find) {
	  		find.clicks += mo.clicks;
	  	} else {
	  		const pushed = mediaccounts.push({
	  			media_id: mo.media_id,
	  			clicks: mo.clicks,
					name: () => needle('get', `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${mo.media_id}`, {}, {
					headers: {
						"X-Riot-Token": process.env.RIOT_TOKEN
					}
				})
	  		});
	  	}
	  });
	});

	await Promise.all(mediaccounts.map(c => c.name().then(t => {
  		c.name = t.body.name;
  	}
  	)));
	mediaccounts.sort((a, b) => b.clicks - a.clicks)
	res.status(201).json(mediaccounts);
})


const currentUser = asyncHandler(async(req, res) => {
	res.status(201).json(req.user);
});

const checkExistingField = asyncHandler(async(req, res) => {
	//display_name or email.
	const exists = await User.findOne({ [req.query.field]: req.query.value });
	if(exists) {
		res.status(201).send(true)
	}
	res.status(201).send(false);
})
module.exports = {
	registerUser,
	loginUser,
	currentUser,
	addMedia,
	updateClicks,
	deleteMedia,
	getMediaDetails,
	getMediaGraphCounts,
	checkExistingField,
	updateLastCheckDate,
};
