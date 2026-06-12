//src/services/auditService.js
"use strict";
const pool = require("../config/db");

async function registrarLog(
  usuarioId,
  accion,
  ip = null,
  userAgent = null,
  detalle = null,
) {
  const query = `
    INSERT INTO logs_auditoria (usuario_id, accion, ip, user_agent, detalle)
    VALUES ($1, $2, $3, $4, $5)
  `;
  await pool.query(query, [
    usuarioId,
    accion,
    ip,
    userAgent,
    detalle ? JSON.stringify(detalle) : null,
  ]);
}

module.exports = { registrarLog };
