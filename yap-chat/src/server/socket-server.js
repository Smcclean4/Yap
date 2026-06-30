import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
// Render will inject the port via $PORT; keep 3001 as a local/dev fallback.
const port = process.env.PORT ?? 3001;
const server = createServer(app);

const io = new Server(server, {
  cors: {
    // Allow your deployed frontend to connect.
    // You can set this to a single origin (e.g. https://yap.onrender.com)
    // or a comma-separated list.
    origin: (() => {
      const raw = process.env.CORS_ORIGIN ?? "http://localhost:3000";
      if (raw === "*") return "*";
      return raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    })(),
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

  // broadcast when a new yap has been created in the app
  socket.on("yap:created", (payload) => {
    // notify all other connected clients so they can refresh their data
    socket.broadcast.emit("yap:created", payload);
    console.log("yap created event:", payload);
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

const portNumber = Number(port);

server.listen(portNumber, "0.0.0.0", () => {
  console.log(`server running at http://0.0.0:${portNumber}`);
});
