import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL
  ? process.env.NEXT_PUBLIC_SOCKET_SERVER_URL
  : process.env.NODE_ENV === "production"
    ? undefined
    : "http://localhost:3001";

export const socket = io(URL);
