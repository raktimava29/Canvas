"use strict";

var express = require('express');

var _require = require('../controllers/content-controller'),
    saveContent = _require.saveContent,
    getContent = _require.getContent;

var protect = require('../config/protect');

var router = express.Router();
router.post('/save', protect, saveContent);
router.get('/', protect, getContent);
router.get('/shared', getContent);
module.exports = router;