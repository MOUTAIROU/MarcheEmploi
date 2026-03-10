"use client";
import { io } from "socket.io-client";

export const socket = io(`${process.env.SERVER_HOST}`, {
  autoConnect: false, // on connecte manuellement
});
