"use strict";

var express = require('express');

var _require = require('../controllers/user-controller'),
    registerUser = _require.registerUser,
    loginUser = _require.loginUser,
    googleLogin = _require.googleLogin,
    allUsers = _require.allUsers;

var protect = require('../config/protect');

var router = express.Router();
router.route('/').post(registerUser).get(protect, allUsers);
router.post('/login', loginUser);
router.post('/google', googleLogin);
module.exports = router;