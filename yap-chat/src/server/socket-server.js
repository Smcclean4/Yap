import express from "express";
import { createServer } from "node:http";
import { isBooleanObject } from "node:util/types";
import { Server } from "socket.io";

const app = express();
const port = 3001;
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
  connectionStateRecovery: {},
});

const connectedUsers = {};

app.get("/", (req, res) => {
  res.send("<h1>This Is Your Socket.io Server</h1>");
});

io.on("connection", (socket) => {
  console.log("a user connected: " + socket.id);
  socket.on("disconnect", () => {
    console.log("a user disconnected: " + socket.id);
    // @ts-ignore
    delete connectedUsers[socket.id];
  });
});

io.on("connection", (socket) => {
  // all chat message
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
    console.log("chat message: " + msg);
  });
  // socket.io connection for private message
  socket.on("private message", (userId, msg) => {
    socket.join(userId)
    console.log("joined room: " + userId)
    io.in(userId).emit("private message", msg);
    console.log("Private Message to " + userId + ": " + msg);
  });
});

server.listen(port, () => {
  console.log(`server running at ${port}`);
});
