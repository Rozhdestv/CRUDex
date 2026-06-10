// src/controllers/authControllers.js
"use strict";
const authService = require("../services/authService");
const pool = require("../config/db");
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
    await pool.query(
      `INSERT INTO logs_auditoria (usuario_id,accion, ip, user_agent, detalle) VALUES (NULL,'login fallido', $1, $2, $3)`,
      [
        ip,
        userAgent,
        JSON.stringify({ username: username, error: result.error }),
      ],
    );
    return res.status(401).json({ success: false, error: result.error });
  }
  req.session.user = result.user;
  req.session.touch();

  await usuarioRepository.updateLastLogin(result.user.id);
  await pool.query(
    `INSERT INTO logs_auditoria (usuario_id,accion, ip, user_agent, detalle) VALUES ($1,'login exitoso', $2, $3, $4)`,
    [result.user.id, ip, userAgent, JSON.stringify({ username: username })],
  );
  res.json({ success: true, user: result.user });
};

const logout = async (req, res) => {
  if (!req.session.user) {
    return res.status(400).json({ success: false, error: "No autenticado" });
  }
  const userId = req.session.user.id;
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: "Error al cerrar sesión" });
    }
  res.clearCookie(process.env.SESSION_NAME || "connect.sid");
  await pool.query(
    `INSERT INTO logs_auditoria (usuario_id,accion) VALUES ($1,'logout')`,
    [userId],
  ).catch(console.error);
  res.json({ success: true });
  });
};

const getCurrentUser = (req, res) => {
    if(!req.session.user){
        return res.status(401).json({success:false,error: "No autenticado"});
    }
    res.json({success:true,user:req.session.user});
};

module.exports = {
  login,
  logout,
  getCurrentUser,
};