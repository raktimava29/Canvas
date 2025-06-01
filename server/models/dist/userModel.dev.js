"use strict";

var mongoose = require("mongoose");

var bcrypt = require("bcryptjs");

var userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String
  },
  googleId: {
    type: String
  },
  isOAuth: {
    type: Boolean,
    "default": false
  }
}, {
  timestamps: true
});
var User = mongoose.model("User", userSchema);
module.exports = User;