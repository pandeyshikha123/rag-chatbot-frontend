// src/services/socket.ts
import { io, Socket } from "socket.io-client";

export function socketConnect(sessionId: string): Socket {
  const base = process.env.REACT_APP_API_BASE || "http://localhost:4000";
  const socket = io(base);
  socket.on("connect", () => {
    socket.emit("join", { sessionId });
  });
  return socket;
}
