const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLogin,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);

module.exports = router;
