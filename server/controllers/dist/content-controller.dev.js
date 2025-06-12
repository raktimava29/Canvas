"use strict";

var asyncHandler = require('express-async-handler');

var Content = require('../models/contentModel'); // @desc    Save or update notepad and whiteboard content
// @route   POST /api/content/save
// @access  Private


var saveContent = asyncHandler(function _callee(req, res) {
  var _req$body, videoUrl, notepadText, canvasImage, userId, content;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, videoUrl = _req$body.videoUrl, notepadText = _req$body.notepadText, canvasImage = _req$body.canvasImage;
          userId = req.user._id;
          _context.next = 4;
          return regeneratorRuntime.awrap(Content.findOneAndUpdate({
            videoUrl: videoUrl,
            user: userId
          }, {
            notepadText: notepadText,
            canvasImage: canvasImage
          }, {
            upsert: true,
            "new": true
          }));

        case 4:
          content = _context.sent;

          if (!(!videoUrl || !videoUrl.trim())) {
            _context.next = 8;
            break;
          }

          res.status(400);
          throw new Error('Video URL is required');

        case 8:
          res.json(content);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}); // @desc    Get content for a video URL (by owner or another user)
// @route   GET /api/content
// @access  Private

var getContent = asyncHandler(function _callee2(req, res) {
  var _req$query, videoUrl, userId, targetUser, content;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$query = req.query, videoUrl = _req$query.videoUrl, userId = _req$query.userId;
          targetUser = userId || req.user._id;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Content.findOne({
            videoUrl: videoUrl,
            user: targetUser
          }));

        case 4:
          content = _context2.sent;

          if (content) {
            _context2.next = 8;
            break;
          }

          res.status(404);
          throw new Error('No content found for this URL and user.');

        case 8:
          res.json(content);

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
});
module.exports = {
  saveContent: saveContent,
  getContent: getContent
};