const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
const needle = require('needle');

const getContacts = asyncHandler(async(req, res) => {
	// summoner name https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/EclipseOfHearts
  const endpointURL = "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/5neCwtn-6X1WV-wc97vdyx_XOpASASZf3a5LljcJ370TI51SXSR7cWwE4RcCs3kGlTI0FHDgIv9a8w/ids?start=0&count=20";
  const endpointURL2 = "https://americas.api.riotgames.com/lol/match/v5/matches/NA1_4742939925";
  try {
	  const res1 = await needle('get', endpointURL, {}, {
	    headers: {
	      "X-Riot-Token": "RGAPI-061f2ef7-14ca-48d0-a7ed-270a4543eb76"
	    }
	  });
	  const res2 = await needle('get', endpointURL2, {}, {
	    headers: {
	      "X-Riot-Token": "RGAPI-061f2ef7-14ca-48d0-a7ed-270a4543eb76"
	    }
	  });
	  console.log(res1.body, res2.body); //JSON.stringify(res1.body, null, 2)
	} catch(err){
		console.log(err);
	}

	const contacts = await Contact.find({ user_id: req.user._id });
	res.status(200).json(contacts);
});

const createContact = asyncHandler(async(req, res) => {
	console.log('The request body is: ', req.body);
	const { name, email, phone } = req.body;
	if (!name || !email || !phone) {
		res.status(400);
		throw new Error("All fields are mandatory");
	}
	const contact = await Contact.create({
		name,
		email,
		phone,
		user_id: req.user._id,
	});
	res.status(201).json(contact);
});

const getContact = asyncHandler(async(req, res) => {
	const contact = await Contact.findById(req.params.id);
	if(!contact) {
		res.status(404);
		throw new Error("Contact not found");
	}
	res.status(200).json(contact);
});

const updateContact = asyncHandler(async(req, res) => {
	const contact = await Contact.findById(req.params.id);
	if(!contact) {
		res.status(404);
		throw new Error('Contact not found');
	}
	if(contact.user_id.toString() !== req.user._id){
		res.status(403);
		throw new Error("User doesn't have permission to update other user contacts");
	}
	const updatedContact = await Contact.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true }
	);
  res.status(200).json(updatedContact);
});

const deleteContact = asyncHandler(async(req, res) => {
	const contact = await Contact.findById(req.params.id);
	if(!contact) {
		res.status(404);
		throw new Error("Contact not found");
	}
	if(contact.user_id.toString() !== req.user._id){
		res.status(403);
		throw new Error("User doesn't have permission to update other user contacts");
	}
	await Contact.findByIdAndRemove(req.params.id);
	res.status(200).json(contact);
});

module.exports = { getContacts, getContact, createContact, updateContact, deleteContact };