const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
		display_name: {
			type: String,
			required: [true, "Please add display name"]
		},
		email: {
			type: String,
			required: [true, "Please add the user email address"],
			unique: [true, "Email address already taken"],
		},
		password: {
			type: String,
			required: [true, "Please add the user password"],
		},
		media: {
			league: { type: {}, default: { lastcheckdate: 1666747185, values: []} },
			instagram: { type: {}, default: { lastcheckdate: 1666747185, values: []} },
			youtube: { type: {}, default: { lastcheckdate: 1666747185, values: []} },
			linkedin: { type: {}, default: { lastcheckdate: 1666747185, values: []} },
			twitch: { type: {}, default: { lastcheckdate: 1666747185, values: []} },
		},
		/*
		sharedPost: { //create shared post, return post objectid and post it here. 2 calls.
			type: [mongoose.Schema.Types.ObjectId],
			default: [],
			ref: "SharedPosts",
		}*/
	},
	{
	  timestamps: true,
	}
);

module.exports = mongoose.model('User', userSchema);