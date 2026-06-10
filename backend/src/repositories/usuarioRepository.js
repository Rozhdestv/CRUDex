// src/repositories/usuarioRepository.js
"use strict";
const pool = require("../config/db");

const findByUsername = async (username) => {
  const result = await pool.query(
    `SELECT id,username,email,password_hash,nombre,activo
    FROM usuarios WHERE  username = $1`,
    [username],
  );
  return result.rows[0];
};

const updateLastLogin = async (userId) => {
  await pool.query(`UPDATE usuarios SET ultimo_login = NOW() WHERE id = $1`, [
    userId,
  ]);
};

module.exports = {
  findByUsername,
  updateLastLogin,
};
