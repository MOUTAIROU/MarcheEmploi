// lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.SERVER_HOST || "http://localhost:4000/api",
  withCredentials: true,
});

export default api;