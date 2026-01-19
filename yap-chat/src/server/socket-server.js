import express from "express";
import { createServer } from "node:http";
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

  io.on("connection", (socket) => {
    // online status
    socket.on("online status", (status) => {
      // @ts-ignore
      connectedUsers[socket.id] = status;
      console.log("User " + socket.id + " is " + status);
    });
  });
});

server.listen(port, () => {
  console.log(`server running at ${port}`);
});
