// modules/cors/cors.middleware.js
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(origin => origin.trim())
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    // autoriser les requêtes sans origine (ex: Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // IMPORTANT pour withCredentials
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);
