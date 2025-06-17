const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require('../config/genToken')

// @desc    Register a new user
// @route   POST /api/user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) throw new Error("Please fill all fields");

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("User already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/user/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  if (user.isOAuth) throw new Error("Please log in using Google");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// @desc    Google OAuth Signup
// @route   POST /api/user/google-signup
const googleSignup = asyncHandler(async (req, res) => {
  const { email, username, googleId } = req.body;

  if (!email || !username || !googleId) throw new Error("Missing required fields");

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists. Please log in.");

  const user = await User.create({
    name: username,
    email,
    password: googleId, // not used, but required by schema
    isOAuth: true,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// @desc    Google OAuth Login
// @route   POST /api/user/google-login
const googleLogin = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new Error("Missing email");

  const user = await User.findOne({ email });

  if (!user || !user.isOAuth) throw new Error("Account not found. Please sign up first.");

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// @desc    Get all users (for testing or search)
// @route   GET /api/user
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        name: { $regex: req.query.search, $options: "i" },
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/user/:id
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
});

module.exports = { registerUser, loginUser, googleSignup, googleLogin, allUsers, getUserById};
