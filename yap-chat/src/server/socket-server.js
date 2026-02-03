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

// Presence tracking (in-memory)
// userId -> set of socketIds (supports multiple tabs/devices)
const userSockets = new Map();
// socketId -> userId
const socketToUser = new Map();

const broadcastPresence = () => {
  io.emit("presence:state", {
    onlineUserIds: Array.from(userSockets.keys()),
  });
};
// helper function for emiting chats to a specific user
const emitToUser = (
  /** @type {any} */ userId,
  /** @type {any} */ event,
  /** @type {any} */ payload
) => {
  const sockets = userSockets.get(userId);
  if (!sockets) return;

  for (const socketId of sockets) {
    io.to(socketId).emit(event, payload);
  }
};

app.get("/", (req, res) => {
  res.send("<h1>This Is Your Socket.io Server</h1>");
});

io.on("connection", (socket) => {
  console.log("a user connected: " + socket.id);

  // all chat message
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
    console.log("chat message: " + msg);
  });

  // notify specific user of a new private message
  socket.on("dm:new", (payload, event) => {
    const toUserId = payload?.toUserId;
    if (!toUserId) return;
    emitToUser(toUserId, event, payload);
  });

  // presence identify
  socket.on("presence:join", (payload) => {
    const userId = payload?.userId;
    if (!userId) return;

    socketToUser.set(socket.id, userId);

    const existing = userSockets.get(userId);
    if (existing) {
      existing.add(socket.id);
    } else {
      userSockets.set(userId, new Set([socket.id]));
    }

    broadcastPresence();
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected: " + socket.id);

    const userId = socketToUser.get(socket.id);
    if (userId) {
      socketToUser.delete(socket.id);
      const sockets = userSockets.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSockets.delete(userId);
        }
      }
      broadcastPresence();
    }
  });
});

server.listen(port, () => {
  console.log(`server running at ${port}`);
});
