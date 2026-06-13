const bcrypt = require("bcrypt");
const pool = require("../src/config/db");

async function ensureRolesAndPermissions() {
  // Crear roles si no existen
  await pool.query(`
    INSERT INTO roles (nombre, descripcion)
    VALUES 
      ('admin', 'Acceso total'),
      ('coordinador', 'Gestiona planificaciones'),
      ('docente', 'Solo lectura')
    ON CONFLICT (nombre) DO NOTHING
  `);

  // Crear permisos si no existen
  await pool.query(`
    INSERT INTO permisos (recurso, accion, descripcion)
    VALUES 
      ('planificacion', 'leer', 'Ver listado'),
      ('planificacion', 'crear', 'Crear nueva'),
      ('planificacion', 'editar', 'Modificar'),
      ('planificacion', 'eliminar', 'Borrar')
    ON CONFLICT (recurso, accion) DO NOTHING
  `);

  // Asignar todos los permisos al rol admin
  await pool.query(`
    INSERT INTO rol_permisos (rol_id, permiso_id)
    SELECT r.id, p.id
    FROM roles r, permisos p
    WHERE r.nombre = 'admin'
    ON CONFLICT DO NOTHING
  `);
}

async function createAdminUser() {
  const hash = await bcrypt.hash("12345678", 10);
  await pool.query(
    `
    INSERT INTO usuarios (username, email, password_hash, nombre, activo)
    VALUES ('admin', 'admin@test.com', $1, 'Admin', true)
    ON CONFLICT (username) DO NOTHING
  `,
    [hash],
  );

  await pool.query(`
    INSERT INTO usuario_roles (usuario_id, rol_id)
    SELECT u.id, r.id
    FROM usuarios u, roles r
    WHERE u.username = 'admin' AND r.nombre = 'admin'
    ON CONFLICT DO NOTHING
  `);
}

beforeAll(async () => {
  // Limpiar tablas (opcional, pero asegura estado fresco)
  await pool.query(
    "TRUNCATE usuarios, sessions, logs_auditoria, tema, usuario_roles, rol_permisos RESTART IDENTITY CASCADE",
  );

  await ensureRolesAndPermissions();
  await createAdminUser();
});

afterAll(async () => {
  await pool.end();
  await new Promise((resolve) => setTimeout(resolve, 500));
});
