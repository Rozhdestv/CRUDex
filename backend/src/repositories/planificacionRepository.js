"use strict";
const pool = require("../config/db");

async function crear(tema, descripcion) {
  const result = await pool.query(
    "INSERT INTO tema (tema, descripcion) VALUES ($1, $2) RETURNING id",
    [tema, descripcion],
  );
  return result.rows[0];
}

async function obtenerTodos(limit, offset) {
  const result = await pool.query(
    "SELECT id, tema, descripcion FROM tema LIMIT $1 OFFSET $2",
    [limit, offset],
  );
  return result.rows;
}

async function obtenerTotal() {
  const result = await pool.query("SELECT COUNT(*) FROM tema");
  return parseInt(result.rows[0].count);
}

async function eliminarPorId(id) {
  const result = await pool.query("DELETE FROM tema WHERE id = $1", [id]);
  return result; // contiene rowCount
}

async function actualizar(id, tema, descripcion) {
  const result = await pool.query(
    "UPDATE tema SET tema = $1, descripcion = $2 WHERE id = $3",
    [tema, descripcion, id],
  );
  return result; // contiene rowCount
}

module.exports = {
  crear,
  obtenerTodos,
  obtenerTotal,
  eliminarPorId,
  actualizar,
};
