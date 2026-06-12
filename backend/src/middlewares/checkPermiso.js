// src/middlewares/checkPermiso.js
"use strict";
const { verificarPermisoUsuario } = require("../services/permissionService");

module.exports = (recurso, accion) => {
  return async (req, res, next) => {
    const usuarioId = req.session.user?.id;
    console.log("🔐 [checkPermiso] Usuario ID desde sesión:", usuarioId);
    if (!usuarioId) {
      return res.status(401).json({ success: false, error: "No autenticado" });
    }

    try {
      const tienePermiso = await verificarPermisoUsuario(
        usuarioId,
        recurso,
        accion,
      );
      console.log(
        `✅ [checkPermiso] Permiso para ${recurso}/${accion}: ${tienePermiso}`,
      );
      if (!tienePermiso) {
        return res
          .status(403)
          .json({ success: false, error: "Permiso denegado" });
      }
      next();
    } catch (error) {
      console.error("❌ Error en checkPermiso:", error);
      res.status(500).json({ success: false, error: "Error interno" });
    }
  };
};
