const express = require('express');
const { registerUser, loginUser, googleLogin, allUsers, googleSignup } = require('../controllers/user-controller');
const protect = require('../config/protect');

const router = express.Router();

router.route('/').post(registerUser).get(protect, allUsers);
router.post('/google-signup', googleSignup);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);

module.exports = router;
