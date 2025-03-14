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
  socket.on("private message", (aDifferentSocketId, msg) => {
    // @ts-ignore
    // socket connection string changes so often that searching for thread throws error. save friend id so that thread can be found for that connection
    connectedUsers[socket.id] = aDifferentSocketId;
    console.log(aDifferentSocketId + " received a private message!");
    console.log(connectedUsers);
    socket.to(aDifferentSocketId).emit("private message", socket.id, msg);
    console.log("Private Chat: " + msg);
  });
});

server.listen(port, () => {
  console.log(`server running at ${port}`);
});
