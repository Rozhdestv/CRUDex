/* controllers/planificacionesController.js */
"use strict";
const { body, validationResult } = require("express-validator");
const pool = require("../config/db");
const xss = require("xss");

// ✅ SEGURIDAD: Validaciones y sanitización
const validarPlanificacion = [
  body("tema")
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage("Tema requiere 1-25 caracteres")
    .escape(), // Previene XSS
  body("descripcion")
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage("Descripción requiere 1-25 caracteres")
    .escape(),
];
/**
 * @route POST /api/v1/planificaciones
 * @param {string} tema - 1-25 caracteres
 * @param {string} descripcion - 1-25 caracteres
 * @returns {Object} { success: true, data: { ok: true } }
 * @returns {Object} { success: false, error: string }
 */
const guardarPlanificacion = [
  ...validarPlanificacion,
  async (req, res) => {
    // Validar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, errors: errors.array()[0].msg });
    }

    const { tema, descripcion } = req.body;

    try {
      // ✅ SEGURIDAD: Usa parametrización (ya lo haces bien con $1, $2)
      await pool.query("INSERT INTO tema (tema, descripcion) VALUES ($1, $2)", [
        tema,
        descripcion,
      ]);
      res.json({ success: true, data: { ok: true } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Error interno" });
    }
  },
];

const obtenerPlanificaciones = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const resultado = await pool.query(
      "SELECT * FROM tema LIMIT $1 OFFSET $2",
      [limit, offset],
    );
    const total = await pool.query("SELECT COUNT(*) FROM tema");
    // ✅ SEGURIDAD: Sanitiza datos antes de enviar
    const sanitizedRows = resultado.rows.map((row) => ({
      id: row.id,
      tema: xss(row.tema),
      descripcion: xss(row.descripcion),
    }));
    res.json({
      success: true,
      data: sanitizedRows,
      pagination: {
        page: Number(page),
        total: parseInt(total.rows[0].count),
        pages: Math.ceil(total.rows[0].count / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error interno" });
  }
};

const eliminarPlanificacion = async (req, res) => {
  const { id } = req.params;

  // ✅ SEGURIDAD: Validar que id sea número
  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: "ID inválido" });
  }

  try {
    await pool.query("DELETE FROM tema WHERE id=$1", [id]);
    res.json({ success: true, data: { ok: true } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error interno" });
  }
};

const actualizarPlanificacion = [
  ...validarPlanificacion,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, errors: errors.array()[0].msg });
    }

    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "ID inválido" });
    }

    const { tema, descripcion } = req.body;

    try {
      await pool.query("UPDATE tema SET tema=$1, descripcion=$2 WHERE id=$3", [
        tema,
        descripcion,
        id,
      ]);
      res.json({ success: true, data: { ok: true } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Error interno" });
    }
  },
];

module.exports = {
  guardarPlanificacion,
  obtenerPlanificaciones,
  eliminarPlanificacion,
  actualizarPlanificacion,
};
