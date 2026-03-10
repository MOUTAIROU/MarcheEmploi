// ./src/utils/constants.js

// ./src/utils/constants.js
const JWT_EXPIRES = "5m";      // Expiration du token d'accès
const REFRESH_EXPIRES = "30d";   // Expiration du refresh token
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";

module.exports = { JWT_EXPIRES, REFRESH_EXPIRES, JWT_SECRET, REFRESH_SECRET };

