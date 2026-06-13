// src/controllers/authControllers.js
"use strict";
const authService = require("../services/authService");
const auditService = require("../services/auditService");
const usuarioRepository = require("../repositories/usuarioRepository");

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, error: "Faltan campos" });
  }
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"];

  const result = await authService.login(username, password);
  if (!result.success) {
    await auditService.registrarLog(null, "login_fallido", ip, userAgent, {
      username,
      error: result.error,
    });
    console.error("Error al iniciar sesión:", result.error); // Log interno
    return res
      .status(401)
      .json({ success: false, error: "Error de autenticación" });
  }

  req.session.user = result.user;
  req.session.touch();
  console.log("📌 [authController] result.user completo:", result.user);
  console.log("📌 [authController] result.user.id:", result.user.id);
  await usuarioRepository.updateLastLogin(result.user.id);

  res.json({ success: true, user: result.user });
};

const logout = (req, res) => {
  if (!req.session.user) {
    return res.status(400).json({ success: false, error: "No autenticado" });
  }
  const userId = req.session.user.id;

  req.session.destroy(async (err) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, error: "Error al cerrar sesión" });
    }
    res.clearCookie(process.env.SESSION_NAME || "connect.sid");

    await auditService.registrarLog(userId, "logout").catch(console.error);
    res.json({ success: true });
  });
};

const getCurrentUser = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, error: "No autenticado" });
  }
  res.json({ success: true, user: req.session.user });
};

module.exports = {
  login,
  logout,
  getCurrentUser,
};
