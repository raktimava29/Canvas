"use strict";

var express = require('express');

var dotenv = require('dotenv');

var cors = require('cors');

var connectDB = require('./config/db');

dotenv.config();
connectDB();
var app = express();
app.use(cors());
app.use(express.json());
var PORT = process.env.PORT || 5000;
app.get('/', function (req, res) {
  res.send('API is running...');
});
app.listen(PORT, function () {
  console.log("Server running on ".concat(PORT));
});