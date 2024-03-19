const express = require("express");
const router = express.Router();
const {
	getSharedPosts,
	postSharedPost,
	getUserSharedPosts,
	updateLikes,
	getTopFiveStats,
} = require("../controllers/sharedPostsController");
const validateToken = require('../middleware/validateTokenHandler');

router.post('/postSharedPost', validateToken, postSharedPost);
router.get('/getSharedPosts', validateToken, getSharedPosts);
router.get('/getUserSharedPosts', validateToken, getUserSharedPosts);
router.get('/updateLikes', validateToken, updateLikes);
router.get('/getTopFiveStats', validateToken, getTopFiveStats);

module.exports = router;