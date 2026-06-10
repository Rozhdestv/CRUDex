// src/routes/v1/auth.js
"use strict";
const express = require("express");
const router = express.Router();
const {
  login,
  logout,
  getCurrentUser,
} = require("../../controllers/authControllers");
const authMiddleware = require("../../middlewares/authMiddleware");

router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
