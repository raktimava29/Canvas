"use strict";

var express = require('express');

var dotenv = require('dotenv');

var cors = require('cors');

var connectDB = require('./config/db');

var userRoutes = require('./routes/user-route');

var _require = require('./misc/errors'),
    notFound = _require.notFound,
    errorHandler = _require.errorHandler;

dotenv.config();
connectDB();
var app = express();
app.use(cors());
app.use(express.json());
app.get('/', function (req, res) {
  res.send('API is running...');
});
app.use('/api/user', userRoutes);
var PORT = process.env.PORT || 5000;
app.use(notFound);
app.use(errorHandler);
app.listen(PORT, function () {
  console.log("Server running on ".concat(PORT));
});