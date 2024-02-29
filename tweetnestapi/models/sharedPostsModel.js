const mongoose = require("mongoose");

const sharedPostsSchema = mongoose.Schema({
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		display_name: {
			type: String,
			required: [true, "Please add the display name"],
		},
		media_id: { //mediaid is the profile link. like an instagram profile
			type: String,
			required: [true, "Please add the media id"],
		},
		media_post_id: { //mediapostid is a single instance post, of that instagram profile.
			type: String,
			required: [true, "Please add media post id"]
		},
		media_type: {
			type: String,
			required: [true, "Please add the media type"],
		},
		anon_share: {
			type: Boolean,
			default: false,
		},
		notes: {
			type: String,
			default:'',
		},
		likes: {
			type: [mongoose.Schema.Types.ObjectId],
			default: [],
		},
		dislikes: {
			type: [mongoose.Schema.Types.ObjectId],
			default: [],
			ref: "User",
		}
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("SharedPosts", sharedPostsSchema);