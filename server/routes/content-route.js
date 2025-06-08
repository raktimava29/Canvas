const express = require('express');
const { saveContent, getContent } = require('../controllers/content-controller');
const protect = require('../config/protect');

const router = express.Router();

router.post('/save', protect, saveContent);
router.get('/', protect, getContent);

module.exports = router;
