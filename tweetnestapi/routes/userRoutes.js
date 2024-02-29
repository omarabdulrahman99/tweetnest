const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/userController');
const validateToken = require("../middleware/validateTokenHandler");

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/current', validateToken, currentUser);
router.post('/addMedia', validateToken, addMedia);
router.post('/updateClicks', validateToken, updateClicks);
router.post('/deleteMedia', validateToken, deleteMedia);
router.get('/getMediaDetails', validateToken, getMediaDetails);
router.get('/getMediaGraphCounts', validateToken, getMediaGraphCounts);
router.get('/checkExistingField', checkExistingField);
router.post('/updateLastCheckDate', updateLastCheckDate)

module.exports = router;