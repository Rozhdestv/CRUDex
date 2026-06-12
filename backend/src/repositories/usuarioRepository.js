// src/repositories/usuarioRepository.js
"use strict";

const pool = require("../config/db");

const findByUsername = async (username) => {
  const result = await pool.query(
    `SELECT id, username, email, password_hash, nombre, activo
     FROM usuarios WHERE username = $1`,
    [username],
  );
  return result.rows[0];
};

const updateLastLogin = async (userId) => {
  // 1. Forzar la conversión a número base 10 de manera segura
  const id = parseInt(userId, 10);

  // 2. Si es un string vacío, undefined, NaN o menor a 1, cancelamos la ejecución
  // Esto evita que mandes basura «» a PostgreSQL y tumbe el servidor
  if (!id || isNaN(id) || id <= 0) {
    console.warn(
      "⚠️ [usuarioRepository] updateLastLogin abortado: userId inválido o vacío:",
      userId,
    );
    return; // Sale pacíficamente sin lanzar un error crudo
  }

  // 3. Ejecutar la consulta de forma segura con un número garantizado
  await pool.query(`UPDATE usuarios SET ultimo_login = NOW() WHERE id = $1`, [
    id,
  ]);
};

module.exports = {
  findByUsername,
  updateLastLogin,
};
