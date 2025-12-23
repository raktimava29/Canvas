"use strict";

var express = require('express');

var dotenv = require('dotenv');

var cors = require('cors');

var connectDB = require('./config/db');

var userRoutes = require('./routes/user-route');

var contentRoutes = require('./routes/content-route');

var _require = require('./misc/errors'),
    notFound = _require.notFound,
    errorHandler = _require.errorHandler;

var path = require('path');

dotenv.config();
connectDB();
var app = express();
app.use(cors());
app.use(express.json({
  limit: "20mb"
}));
app.use('/api/user', userRoutes);
app.use('/api/content', contentRoutes); // Deploy

var __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express["static"](path.join(__dirname1, "client", "dist")));
  app.get("/{*any}", function (req, res) {
    res.sendFile(path.join(__dirname1, "client", "dist", "index.html"));
  });
} else {
  app.get('/', function (req, res) {
    res.send('API is running...');
  });
}

console.log(__dirname1);
app.use(notFound);
app.use(errorHandler);
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  return console.log("Server Started on PORT ".concat(PORT));
});