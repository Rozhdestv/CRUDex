// tests/setup.js
const bcrypt = require("bcrypt");
const pool = require("../src/config/db");

beforeAll(async () => {
  // Limpiar tablas
  await pool.query(
    "TRUNCATE usuarios, sessions, logs_auditoria, tema, usuario_roles, rol_permisos RESTART IDENTITY CASCADE",
  );

  // Insertar usuario admin con hash real
  const hash = await bcrypt.hash("12345678", 10);
  await pool.query(
    `
    INSERT INTO usuarios (username, email, password_hash, nombre, activo)
    VALUES ('admin', 'admin@test.com', $1, 'Admin', true)
  `,
    [hash],
  );

  // Asignar rol admin
  await pool.query(`
    INSERT INTO usuario_roles (usuario_id, rol_id)
    VALUES (1, (SELECT id FROM roles WHERE nombre = 'admin'))
  `);

  // 🔥 Asignar TODOS los permisos de planificacion al admin
  await pool.query(`
    INSERT INTO rol_permisos (rol_id, permiso_id)
    SELECT r.id, p.id
    FROM roles r, permisos p
    WHERE r.nombre = 'admin'
      AND p.recurso = 'planificacion'
    ON CONFLICT DO NOTHING
  `);
});

afterAll(async () => {
  await pool.end();
  // Esperar un poco para que cierren las conexiones internas
  await new Promise((resolve) => setTimeout(resolve, 500));
});
