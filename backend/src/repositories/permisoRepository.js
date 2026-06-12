// src/repositories/permisoRepository.js
"use strict";
const pool = require("../config/db");

async function verificarPermiso(usuarioId, recurso, accion) {
  const query = `
    WITH permisos_reunidos AS (
        SELECT p.recurso, p.accion, TRUE as concedido
        FROM usuario_roles ur
        JOIN rol_permisos rp ON rp.rol_id = ur.rol_id
        JOIN permisos p ON p.id = rp.permiso_id
        WHERE ur.usuario_id = $1 AND p.recurso = $2 AND p.accion = $3
        UNION ALL
        SELECT p.recurso, p.accion, up.concedido
        FROM usuario_permisos up
        JOIN permisos p ON p.id = up.permiso_id
        WHERE up.usuario_id = $1 AND p.recurso = $2 AND p.accion = $3
    )
    SELECT EXISTS (
        SELECT 1 
        FROM permisos_reunidos
        GROUP BY recurso, accion
        HAVING NOT (FALSE = ANY(array_agg(concedido)))
    ) AS tiene_permiso;
  `;
  const { rows } = await pool.query(query, [usuarioId, recurso, accion]);
  return rows[0]?.tiene_permiso || false;
}

module.exports = { verificarPermiso };
