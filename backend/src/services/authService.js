// src/services/authService.js
"use strict";
const bcrypt = require("bcrypt");
const usuarioRepository = require("../repositories/usuarioRepository");

const login = async (username, password) => {
  const user = await usuarioRepository.findByUsername(username);
  if (!user) return { success: false, error: "Usuario no encontrado" };
  if (!user.activo) return { success: false, error: "Usuario inactivo" };
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return { success: false, error: "Contraseña incorrecta" };
  return {
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      nombre: user.nombre,
    },
  };
};

module.exports = {
  login,
};
