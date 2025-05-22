"use strict";

var express = require('express');

var dotenv = require('dotenv');

var cors = require('cors');

var app = express();
var PORT = process.env.PORT || 5000;
dotenv.config();
app.use(cors());
app.use(express.json());
app.get('/', function (req, res) {
  res.send('API is running...');
});
app.listen(PORT, function () {
  console.log("Server running on PORT:".concat(PORT));
});