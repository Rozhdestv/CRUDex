// server.js
"use strict";
// Cargar variables de entorno primero que nada
require("dotenv").config();

const app = require("./app");
const pool = require("./src/config/db");

const PORT = process.env.PORT || 3000;

// Verificar la conexión a la base de datos antes de levantar el servidor
pool
  .query("SELECT NOW()")
  .then(() => {
    console.log("💾 Conexión a la base de datos PostgreSQL exitosa.");

    // Ahora sí, levantamos el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(
      "❌ Error crítico: No se pudo conectar a la base de datos:",
      err,
    );
    process.exit(1); // Detiene la aplicación por completo si no hay BD
  });
