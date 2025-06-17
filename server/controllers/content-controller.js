const asyncHandler = require('express-async-handler');
const Content = require('../models/contentModel');

// @desc    Save or update notepad and whiteboard content
// @route   POST /api/content/save
// @access  Private
const saveContent = asyncHandler(async (req, res) => {
  const { videoUrl, notepadText, canvasImage } = req.body;
  const userId = req.user._id;

  const content = await Content.findOneAndUpdate(
    { videoUrl, user: userId },
    { notepadText, canvasImage },
    { upsert: true, new: true }
  );

  if (!videoUrl || !videoUrl.trim()) {
  res.status(400);
  throw new Error('Video URL is required');
}
  res.json(content);
});

// @desc    Get content for a video URL (by owner or another user)
// @route   GET /api/content
// @access  Private
const getContent = asyncHandler(async (req, res) => {
  const { videoUrl, userId } = req.query;
  const targetUser = userId || req.user._id;

  const content = await Content.findOne({
    videoUrl,
    user: targetUser,
  });

  if (!content) {
    res.status(404);
    throw new Error('No content found for this URL and user.');
  }

  res.json(content);
});

module.exports = { saveContent, getContent };
