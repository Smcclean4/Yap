import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const port = 3001;
const server = createServer(app);

const io = new Server(server);

app.get("/", (req, res) => {
  res.send("<h1>This Is Your Socket.io Server</h1>");
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(port, () => {
  console.log(`server running at ${port}`);
});
