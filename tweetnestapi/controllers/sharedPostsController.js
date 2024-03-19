const asyncHandler = require("express-async-handler");
const SharedPosts = require("../models/sharedPostsModel");
const needle = require('needle');
const aws = require('@aws-sdk/client-s3');
const presigner = require('@aws-sdk/s3-request-presigner');
const constants = require('./constants');
const User = require("../models/userModel");

const s3 = new aws.S3Client({
	credentials: {
		accessKeyId: process.env.ACCESS_KEY,
		secretAccessKey: process.env.SECRET_ACCESS_KEY,
	},
	region: process.env.BUCKET_REGION,
});

const getTopFiveStats = asyncHandler(async(req, res) => {
	try {
		const sharedMediaCount = {};
		// list of sharedposts, count each media_id.
		const posts = await SharedPosts.find({ media_type: req.query.media_type });
		const postCounts = posts.reduce((agg, post) => {
			agg[post.name] = (agg[post.name] || 0) + 1;
			return agg;
		}, {});
		const postsResult = Object.entries(postCounts)
		  .map(([name, count]) => ({ name, count }))
		  .sort((a, b) => b.count - a.count)
		  .slice(0, 5);
		// loop through each user's profiles and count.
		const users = await User.find();
		// loop users with mediatype obj, loop values store count in obj
		const usersCount = users.reduce((agg, userobj) => {
			userobj.media[req.query.media_type].values.forEach((mediaobj) => {
				agg[mediaobj.media_name] = (agg[mediaobj.media_name] || 0) + 1;
			});
			return agg;
		}, {});
		const usersResult = Object.entries(usersCount)
			.map(([name, count]) => ({ name, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 5);

	res.status(201).json({ postsResult, usersResult });
	} catch (err) {
		res.status(400);
		throw new Error(err);
	}
});

const getUserSharedPosts = asyncHandler(async(req, res) => {
	// req.query.media_type,
	try {
		const posts = await SharedPosts.find({ user_id: req.user._id, media_type: req.query.media_type });
		if (!posts) {
			res.status(201).json([]);
		}
		const mediareturndata = [];
		for(let i = 0; i < posts.length; i++) {
			mediareturndata.push({
				mediadetails: () => needle('get', constants.media_types(req.query.media_type, posts[i].media_post_id), {}, {
				headers: {
					"X-Riot-Token": "RGAPI-03391ca4-1b94-47c9-8885-db3c4c8ac98d"
				}
			}),
				sharedpostdetails: {
					sharedpostid: posts[i]._id,
					media_post_id: posts[i].media_post_id,
					net_likes: posts[i].likes.length - posts[i].dislikes.length,
					interaction:  posts[i].likes.find(f => String(f) === req.user._id) ? 1 :
						posts[i].dislikes.find(f => String(f) === req.user._id) ? -1 : 0,
					display_name: posts[i].display_name,
					notes: posts[i].notes,
					anon_share: posts[i].anon_share,
					media_id: posts[i].media_id
				},
			}
			);
		}
  	const results = await Promise.all(mediareturndata.map(c => c.mediadetails().then(t => {
  		 c.mediadetails = detailsreturn(req.query.media_type, t.body.info);
  	}
  	)));
		res.status(201).json(mediareturndata);
	} catch(err) {
		res.status(400);
		throw new Error(err);
	}
});

const getSharedPosts = asyncHandler(async(req, res) => {
	// on ui click 'load more' > call this > append next 10 data set to existing array in ui due to rate limiting
	try {
		// media_type, sortBy, sortOrder, 
		// if sorting by likes need aggregate, createdAt
		let posts = [];
		if (req.query.sortBy === 'likes') {
			posts = await SharedPosts.aggregate([
			  {
			    "$addFields": {
			      "diff": {
			        "$subtract": [
			          {
			            "$size": "$likes"
			          },
			          {
			            "$size": "$dislikes"
			          }
			        ]
			      }
			    }
			  },
			  {
			    "$sort": {
			      "diff": -1
			    }
			  },
			  {
			    "$unset": [
			      "diff"
			    ]
			  }
			])
		} else {
			posts = await SharedPosts.find({ media_type: req.query.media_type }).sort({ [req.query.sortBy]: req.query.sortOrder});
		}
		if (posts.length === 0) {
			return res.status(201).json([]);
		}
		// req needs array.length of current data on ui,10
		const postsSlice = [...posts.slice(req.query.startIndex, 10)];
		const mediareturndata = [];
		for(let i = 0; i < postsSlice.length; i++) {
			mediareturndata.push({
				mediadetails: () => needle('get', constants.media_types(req.query.media_type, posts[i].media_post_id), {}, {
				headers: {
					"X-Riot-Token": "RGAPI-cfcc6a3f-283d-4071-b889-7acaebe28fc4"
				}
			}),
				sharedpostdetails: {
					sharedpostid: posts[i]._id,
					media_post_id: posts[i].media_post_id,
					net_likes: posts[i].likes.length - posts[i].dislikes.length,
					interaction:  posts[i].likes.find(f => String(f) === req.user._id) ? 1 :
						posts[i].dislikes.find(f => String(f) === req.user._id) ? -1 : 0,
					display_name: posts[i].display_name,
					notes: posts[i].notes,
					anon_share: posts[i].anon_share,
					media_id: posts[i].media_id
				},
			}
			);
		}
  	const results = await Promise.all(mediareturndata.map(c => c.mediadetails().then(t => {
  		 c.mediadetails = constants.detailsreturn(req.query.media_type, t.body.info);
  	}
  	)));
		res.status(201).json(mediareturndata);
	} catch(err) {
		res.status(400);
		throw new Error(err);
	}
})

const postSharedPost = asyncHandler(async(req, res) => {
	const { media_post_id, anon_share = false, notes, media_type, media_id, name } = req.body;
	// check how many posts posted today from start of day today. 10 shares max.
	const previousDay = new Date();
	previousDay.setDate(previousDay.getDate() - 1);
	const dayposts = await SharedPosts.find({ user_id: req.user._id, createdAt: {$gte: previousDay} });
	if (dayposts.length >= 10) {
		throw new Error('Too many posts past 24hrs, 10 max.');
		return res.status(400);
	}
	try {
		const contact = await SharedPosts.create({
			name,
			display_name: req.user.display_name,
			media_id, //media profile id in case its needed for lookup.
			media_post_id, // to use to retrieve the link's posts details freshly
			media_type,//to sort by category (league, instagram, etc)
			anon_share, //whether to include display name or not.
			notes,
			user_id: req.user._id,
		});
		res.status(201).json(contact);
	}catch(err) {
		res.status(400);
		throw new Error(err);
	}

})

const updateLikes = asyncHandler(async(req, res) => {
	// req.query.interaction 1,0,-1   req.query.
	// remove user from array of either disliks or likes, or, add to array of likes or dislikes.
	// field: type: 'likes' or 'dislikes', action:'add' or 'remove', interaction: -1,1 or 0.
	// if user switches from like to dislike, then that is two operations so check previous interaction.
	// if user simply unclicks previous interaction, on u iside determine if switch and send 'like or dislike'
	// in ui, if interaction = 0, and click on div id='like', send 'likes'
	// if interaction = 1, and click on like, send neither likes nor dislikes. it will only remove.
	// if interaction = 1 and click on dislike, send 'dislikes' to increase it.
	// if interaction = -1 and click on like, send 'like' to increase it.
	const post = await SharedPosts.findOne({ _id: req.query.sharedpostid });
	post.dislikes = [...post.dislikes.filter(u => u != req.user._id)];
	post.likes = [...post.likes.filter(u => u != req.user._id)]; //need to use != rather than !== for objectid compare..
	await post.save();

	if (req.query.type === 'likes') {
		post.likes.push(req.user._id);
		await post.save();
	}
	if (req.query.type === 'dislikes') {
		post.dislikes.push(req.user._id);
		await post.save();
	}
	const postupdate = await SharedPosts.find({ _id: req.query.sharedpostid });
	res.status(201).json(postupdate);
});

module.exports = { getSharedPosts, postSharedPost, getUserSharedPosts, updateLikes, getTopFiveStats };