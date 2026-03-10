const express = require("express");
const router = express.Router();
const AuthController = require("./auth.controller");

// Recevoir les données du frontend
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refreshToken);
router.post("/verify-email", AuthController.verifyEmail);

module.exports = router;