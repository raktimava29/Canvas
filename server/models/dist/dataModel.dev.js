"use strict";

var mongoose = require('mongoose');

var DataSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notepadText: {
    type: String,
    "default": ''
  },
  whiteboardImage: {
    type: String,
    "default": ''
  } // base64 string

}, {
  timestamps: true
});
DataSchema.index({
  videoUrl: 1,
  user: 1
}, {
  unique: true
});
module.exports = mongoose.model('Data', DataSchema);