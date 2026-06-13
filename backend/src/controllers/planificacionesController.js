/* controllers/planificacionesController.js */
"use strict";
const planificacionService = require("../services/planificacionService");

const guardarPlanificacion = async (req, res) => {
  const { tema, descripcion } = req.body;
  try {
    const result = await planificacionService.crearPlanificacion(
      tema,
      descripcion,
    );
    res.json({ success: true, data: { id: result.id } });
  } catch (error) {
    // Si el error es de validación (mensaje conocido), responder 400
    if (error.message.includes("requiere 1-25 caracteres")) {
      return res.status(400).json({ success: false, error: error.message });
    }
    // Otros errores (DB, etc.) → 500
    console.error(error);
    res.status(500).json({ success: false, error: "Error interno" });
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
    console.error("Error al obtener planificaciones:", error); // Log interno
    res.status(500).json({
      success: false,
      error: "Error interno al obtener las planificaciones",
    });
  }
};

const actualizarPlanificacion = async (req, res) => {
  const { id } = req.params;
  const { tema, descripcion } = req.body;
  try {
    await planificacionService.actualizarPlanificacion(id, tema, descripcion);
    res.json({ success: true, data: { ok: true } });
  } catch (error) {
    // Errores de validación (datos inválidos o ID no numérico) → 400
    if (
      error.message.includes("requiere 1-25 caracteres") ||
      error.message.includes("ID inválido")
    ) {
      return res.status(400).json({ success: false, error: error.message });
    }
    // Si no se encontró el registro (opcional)
    if (error.message.includes("no encontrada")) {
      return res.status(404).json({ success: false, error: error.message });
    }
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error interno al actualizar" });
  }
};

const eliminarPlanificacion = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await planificacionService.eliminarPlanificacion(id);
    if (result === false) {
      // si el servicio retorna false cuando no existe
      return res
        .status(404)
        .json({ success: false, error: "Planificación no encontrada" });
    }
    res.json({ success: true, data: { ok: true } });
  } catch (error) {
    if (error.message.includes("ID inválido")) {
      return res.status(400).json({ success: false, error: error.message });
    }
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error interno al eliminar" });
  }
};

module.exports = {
  guardarPlanificacion,
  obtenerPlanificaciones,
  eliminarPlanificacion,
  actualizarPlanificacion,
};
