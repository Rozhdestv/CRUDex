//src/services/planificacionService.js
"use strict";
const planificacionRepository = require("../repositories/planificacionRepository");
const xss = require("xss");

async function crearPlanificacion(tema, descripcion) {
  // Lógica de negocio: sanitización, validaciones extra si es necesario
  const temaSanitizado = xss(tema.trim());
  const descSanitizada = xss(descripcion.trim());

  if (temaSanitizado.length < 1 || temaSanitizado.length > 25) {
    throw new Error("Tema requiere 1-25 caracteres");
  }
  if (descSanitizada.length < 1 || descSanitizada.length > 25) {
    throw new Error("Descripción requiere 1-25 caracteres");
  }

  const result = await planificacionRepository.crear(
    temaSanitizado,
    descSanitizada,
  );
  return result;
}

async function listarPlanificaciones(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const [data, total] = await Promise.all([
    planificacionRepository.obtenerTodos(limit, offset),
    planificacionRepository.obtenerTotal(),
  ]);

  // Sanitizar datos antes de devolver
  const sanitizedData = data.map((row) => ({
    id: row.id,
    tema: xss(row.tema),
    descripcion: xss(row.descripcion),
  }));

  return {
    data: sanitizedData,
    pagination: {
      page: Number(page),
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

async function eliminarPlanificacion(id) {
  if (isNaN(id)) throw new Error("ID inválido");
  await planificacionRepository.eliminarPorId(id);
}

async function actualizarPlanificacion(id, tema, descripcion) {
  if (isNaN(id)) throw new Error("ID inválido");

  const temaSanitizado = xss(tema.trim());
  const descSanitizada = xss(descripcion.trim());

  if (temaSanitizado.length < 1 || temaSanitizado.length > 25) {
    throw new Error("Tema requiere 1-25 caracteres");
  }
  if (descSanitizada.length < 1 || descSanitizada.length > 25) {
    throw new Error("Descripción requiere 1-25 caracteres");
  }

  await planificacionRepository.actualizar(id, temaSanitizado, descSanitizada);
}

module.exports = {
  crearPlanificacion,
  listarPlanificaciones,
  eliminarPlanificacion,
  actualizarPlanificacion,
};
