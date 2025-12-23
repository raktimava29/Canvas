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

var http = require('http');

var _require2 = require('socket.io'),
    Server = _require2.Server;

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
var server = http.createServer(app);
var io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
io.on("connection", function (socket) {
  console.log("User connected:", socket.id);
  socket.on("note:update", function (_ref) {
    var roomId = _ref.roomId,
        content = _ref.content;
    socket.to(roomId).emit("note:sync", {
      content: content
    });
  });
  socket.on("board:update", function (point) {
    socket.broadcast.emit("board:sync", point);
  });
  socket.on("disconnect", function () {
    console.log("User disconnected:", socket.id);
  });
});
server.listen(PORT, function () {
  return console.log("Server Started on PORT ".concat(PORT));
});