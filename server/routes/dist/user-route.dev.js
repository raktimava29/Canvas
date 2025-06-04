"use strict";

var express = require('express');

var _require = require('../controllers/user-controller'),
    registerUser = _require.registerUser,
    loginUser = _require.loginUser,
    googleLogin = _require.googleLogin,
    allUsers = _require.allUsers,
    googleSignup = _require.googleSignup;

var protect = require('../config/protect');

var router = express.Router();
router.route('/').post(registerUser).get(protect, allUsers);
router.post('/google-signup', googleSignup);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);
module.exports = router;