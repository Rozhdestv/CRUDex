/* controllers/planificacionesController.js */
"use strict";
const planificacionService = require("../services/planificacionService");

const guardarPlanificacion = async (req, res) => {
  const { tema, descripcion } = req.body;
  try {
    await planificacionService.crearPlanificacion(tema, descripcion);
    res.json({ success: true, data: { ok: true } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const obtenerPlanificaciones = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const result = await planificacionService.listarPlanificaciones(
      page,
      limit,
    );
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const eliminarPlanificacion = async (req, res) => {
  const { id } = req.params;
  try {
    await planificacionService.eliminarPlanificacion(id);
    res.json({ success: true, data: { ok: true } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const actualizarPlanificacion = async (req, res) => {
  const { id } = req.params;
  const { tema, descripcion } = req.body;
  try {
    await planificacionService.actualizarPlanificacion(id, tema, descripcion);
    res.json({ success: true, data: { ok: true } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  guardarPlanificacion,
  obtenerPlanificaciones,
  eliminarPlanificacion,
  actualizarPlanificacion,
};
