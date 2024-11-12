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
});

app.get("/", (req, res) => {
  res.send("<h1>This Is Your Socket.io Server</h1>");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

server.listen(port, () => {
  console.log(`server running at ${port}`);
});
