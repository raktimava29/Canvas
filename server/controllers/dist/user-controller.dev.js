"use strict";

var asyncHandler = require("express-async-handler");

var User = require("../models/userModel");

var bcrypt = require("bcryptjs");

var generateToken = require('../config/genToken'); // @desc    Register a new user
// @route   POST /api/user


var registerUser = asyncHandler(function _callee(req, res) {
  var _req$body, name, email, password, userExists, salt, hashedPassword, user;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password;

          if (!(!name || !email || !password)) {
            _context.next = 3;
            break;
          }

          throw new Error("Please fill all fields");

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 5:
          userExists = _context.sent;

          if (!userExists) {
            _context.next = 8;
            break;
          }

          throw new Error("User already exists");

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 10:
          salt = _context.sent;
          _context.next = 13;
          return regeneratorRuntime.awrap(bcrypt.hash(password, salt));

        case 13:
          hashedPassword = _context.sent;
          _context.next = 16;
          return regeneratorRuntime.awrap(User.create({
            name: name,
            email: email,
            password: hashedPassword
          }));

        case 16:
          user = _context.sent;
          res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  });
}); // @desc    Authenticate user & get token
// @route   POST /api/user/login

var loginUser = asyncHandler(function _callee2(req, res) {
  var _req$body2, email, password, user, isMatch;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 3:
          user = _context2.sent;

          if (user) {
            _context2.next = 6;
            break;
          }

          throw new Error("User not found");

        case 6:
          if (!user.isOAuth) {
            _context2.next = 8;
            break;
          }

          throw new Error("Please log in using Google");

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 10:
          isMatch = _context2.sent;

          if (isMatch) {
            _context2.next = 13;
            break;
          }

          throw new Error("Invalid credentials");

        case 13:
          res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
          });

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // @desc    Google OAuth Signup
// @route   POST /api/user/google-signup

var googleSignup = asyncHandler(function _callee3(req, res) {
  var _req$body3, email, username, googleId, existingUser, user;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body3 = req.body, email = _req$body3.email, username = _req$body3.username, googleId = _req$body3.googleId;

          if (!(!email || !username || !googleId)) {
            _context3.next = 3;
            break;
          }

          throw new Error("Missing required fields");

        case 3:
          _context3.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 5:
          existingUser = _context3.sent;

          if (!existingUser) {
            _context3.next = 8;
            break;
          }

          throw new Error("User already exists. Please log in.");

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap(User.create({
            name: username,
            email: email,
            password: googleId,
            // not used, but required by schema
            isOAuth: true
          }));

        case 10:
          user = _context3.sent;
          res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // @desc    Google OAuth Login
// @route   POST /api/user/google-login

var googleLogin = asyncHandler(function _callee4(req, res) {
  var email, user;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          email = req.body.email;

          if (email) {
            _context4.next = 3;
            break;
          }

          throw new Error("Missing email");

        case 3:
          _context4.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 5:
          user = _context4.sent;

          if (!(!user || !user.isOAuth)) {
            _context4.next = 8;
            break;
          }

          throw new Error("Account not found. Please sign up first.");

        case 8:
          res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
          });

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // @desc    Get all users (for testing or search)
// @route   GET /api/user

var allUsers = asyncHandler(function _callee5(req, res) {
  var keyword, users;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          keyword = req.query.search ? {
            name: {
              $regex: req.query.search,
              $options: "i"
            }
          } : {};
          _context5.next = 3;
          return regeneratorRuntime.awrap(User.find(keyword).find({
            _id: {
              $ne: req.user._id
            }
          }));

        case 3:
          users = _context5.sent;
          res.json(users);

        case 5:
        case "end":
          return _context5.stop();
      }
    }
  });
}); // @desc    Get user by ID
// @route   GET /api/user/:id

var getUserById = asyncHandler(function _callee6(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.params.id).select("-password"));

        case 2:
          user = _context6.sent;

          if (user) {
            _context6.next = 6;
            break;
          }

          res.status(404);
          throw new Error("User not found");

        case 6:
          res.json(user);

        case 7:
        case "end":
          return _context6.stop();
      }
    }
  });
});
module.exports = {
  registerUser: registerUser,
  loginUser: loginUser,
  googleSignup: googleSignup,
  googleLogin: googleLogin,
  allUsers: allUsers,
  getUserById: getUserById
};