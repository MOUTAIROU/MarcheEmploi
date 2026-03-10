// lib/socket.js
import { io } from "socket.io-client";

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(process.env.SERVER_HOST, {
      withCredentials: true,
    });
  }
  return socket;
}