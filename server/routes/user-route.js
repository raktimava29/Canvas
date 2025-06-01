const express = require('express');
const { registerUser, loginUser, googleLogin, allUsers } = require('../controllers/user-controller');
const protect = require('../config/protect');

const router = express.Router();

router.route('/').post(registerUser).get(protect, allUsers);

router.post('/login', loginUser);
router.post('/google', googleLogin);

module.exports = router;
