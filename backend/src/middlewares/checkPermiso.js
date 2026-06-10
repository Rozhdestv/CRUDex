// src/middlewares/checkPermiso.js
"use strict";
const pool = require("../config/db");

module.exports = (recurso, accion) => {
  return async (req, res, next) => {
    const usuarioId = req.session.user?.id;
    if (!usuarioId)
      return res.status(401).json({ success: false, error: "No autenticado" });

    const query = `
        SELECT EXISTS (
            SELECT 1 FROM usuario_roles ur
            JOIN rol_permisos  rp ON rp.rol_id = ur.rol_id
            JOIN permisos p ON p.id = rp.permiso_id
            WHERE ur.usuario_id = $1 AND p.recurso = $2 AND p.accion = $3
            UNION ALL
            SELECT 1 FROM usuario_premisos up
            JOIN permisos p ON p.id = up.permiso_id
            WHERE up.usuario_id = $1 AND up.concedido =TRUE
            AND p.recurso = $2 AND p.accion = $3
        ) AS tiene_permiso
        `;
    try {
      const { rows } = await pool.query(query, [usuarioId, recurso, accion]);
      if (!rows[0].tiene_permiso) {
        return res
          .status(403)
          .json({ success: false, error: "Acceso denegado" });
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Error Interno" });
    }
  };
};
