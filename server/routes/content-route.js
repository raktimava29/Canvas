const express = require('express');
const { saveContent, getContent } = require('../controllers/content-controller');
const protect = require('../config/protect');

const router = express.Router();

router.post('/save', protect, saveContent);
router.get('/', protect, getContent);
router.get('/shared', getContent);

module.exports = router;
