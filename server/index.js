const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user-route');
const contentRoutes = require('./routes/content-route');
const { notFound, errorHandler } = require('./misc/errors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.use('/api/user',userRoutes);
app.use('/api/content', contentRoutes);

// Deploy
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "client", "dist")));
    app.get("/{*any}", (req, res) => {
      res.sendFile(path.join(__dirname1, "client", "dist", "index.html"));
    });
} else {
    app.get('/', (req, res) => {
      res.send('API is running...');
    });
}

console.log(__dirname1)

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("note:update", ({ roomId, content }) => {
  socket.to(roomId).emit("note:sync", { content });
});

  socket.on("board:update", (point) => {
    socket.broadcast.emit("board:sync", point);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => console.log(`Server Started on PORT ${PORT}`));

