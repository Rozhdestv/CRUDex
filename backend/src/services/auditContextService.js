// services/auditContextService.js
"use strict";
const { setCurrentUser } = require("../repositories/auditContextRepository");

async function establecerUsuarioAuditoria(userId) {
  // Aquí podría haber lógica de negocio (ej. validar userId),
  // pero por ahora solo llama al repo.
  await setCurrentUser(userId);
}

module.exports = { establecerUsuarioAuditoria };
