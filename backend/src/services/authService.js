"use strict";
const bcrypt = require("bcrypt");
const usuarioRepository = require("../repositories/usuarioRepository");

async function login(username, password) {
  const user = await usuarioRepository.findByUsername(username);
  console.log("Usuario encontrado:", user);
  if (!user) return { success: false, error: "Credenciales inválidas" };
  if (!user.activo) return { success: false, error: "Usuario deshabilitado" };
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return { success: false, error: "Credenciales inválidas" };
  return {
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      nombre: user.nombre,
    },
  };
}

module.exports = { login };
