const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      // Not required for Google OAuth users
    },
    googleId: {
      type: String,
      // Only set if user logs in via Google
    },
    avatar: {
      type: String,
      default: "",
    },
    isOAuth: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
