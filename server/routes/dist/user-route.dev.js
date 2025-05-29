"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../controllers/userController"),
    registerUser = _require.registerUser,
    loginUser = _require.loginUser,
    googleLogin = _require.googleLogin;

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
module.exports = router;