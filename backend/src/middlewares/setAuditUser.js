// src/middlewares/setAuditUser.js
"use strict";
const {
  establecerUsuarioAuditoria,
} = require("../services/auditContextService");

module.exports = async (req, res, next) => {
  if (req.session?.user?.id) {
    await establecerUsuarioAuditoria(req.session.user.id);
  }
  next();
};
