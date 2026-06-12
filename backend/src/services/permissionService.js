// src/services/permissionService.js
"use strict";
const permisoRepository = require("../repositories/permisoRepository");

async function verificarPermisoUsuario(usuarioId, recurso, accion) {
  // Validaciones de negocio aquí antes de llamar al repositorio
  return await permisoRepository.verificarPermiso(usuarioId, recurso, accion);
}

module.exports = { verificarPermisoUsuario };
