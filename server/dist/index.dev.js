"use strict";

var express = require('express');

var dotenv = require('dotenv');

var cors = require('cors');

dotenv.config();
var app = express();
app.use(cors());
app.use(express.json());
var PORT = process.env.PORT;
app.get('/', function (req, res) {
  res.send('API is running...');
});
app.listen(PORT, function () {
  console.log("Server running on PORT:".concat(PORT));
});