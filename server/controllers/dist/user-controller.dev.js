"use strict";

var asyncHandler = require("express-async-handler");

var User = require("../models/userModel");

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken"); // Generate JWT


var generateToken = function generateToken(id) {
  return jwt.sign({
    id: id
  }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
}; // @route   POST /api/users/register


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
}); // @route   POST /api/users/login

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
}); // @route   POST /api/users/google

var googleLogin = asyncHandler(function _callee3(req, res) {
  var _req$body3, name, email, googleId, avatar, user;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body3 = req.body, name = _req$body3.name, email = _req$body3.email, googleId = _req$body3.googleId, avatar = _req$body3.avatar;
          _context3.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 3:
          user = _context3.sent;

          if (user) {
            _context3.next = 8;
            break;
          }

          _context3.next = 7;
          return regeneratorRuntime.awrap(User.create({
            name: name,
            email: email,
            googleId: googleId,
            avatar: avatar,
            isOAuth: true
          }));

        case 7:
          user = _context3.sent;

        case 8:
          res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
          });

        case 9:
        case "end":
          return _context3.stop();
      }
    }
  });
});
module.exports = {
  registerUser: registerUser,
  loginUser: loginUser,
  googleLogin: googleLogin
};