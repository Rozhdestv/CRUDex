/*app.js*/
"use strict";

const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./src/config/db");
const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        connectSrc: ["'self'", "http://localhost:3000"],
        fontSrc: [
          "'self'",
          "data:",
          "https://fonts.googleapis.com",
          "https://fonts.gstatic.com",
        ],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        imgSrc: ["'self'", "data:"],
        manifestSrc: ["'self'"],
        mediaSrc: ["'self'"],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"],
        scriptSrcAttr: ["'none'"],
        scriptSrcElem: ["'self'"],
        styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
        styleSrcAttr: ["'none'"],
        styleSrcElem: [
          "'self'",
          "https://fonts.googleapis.com",
          "'unsafe-inline'",
        ],
        upgradeInsecureRequests: [],
        workerSrc: ["'self'"],
      },
    },
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 solicitudes por IP
  message: "Demasiadas peticiones intente mas tarde",
});
app.use("/planificaciones", limiter);

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://dominio.com"
        : "http://localhost:5173",
    credentials: true,
  }),
);

app.disable("x-powered-by");
// ---------- CONFIGURACIÓN DE SESIÓN (NUEVO) ----------
//?? que hace aqui crea una tabla ? acaso no seria esto migracion?
//acaso no deberian estar asi ambien mis otras relaciones?
//siemprbees recomendable usar orm? y cual suo en tal caso sequel?
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "sessions",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 2, // 2 horas
    },
  }),
);
// ---------- CONFIGURACIÓN DE SESIÓN (NUEVO) ----------
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/public")));
app.use("/auth/v1", require("./routes/v1/auth"));
app.use("/planificaciones/v1", require("./src/routes/v1/planificaciones"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});
// ✅ Exporta la app para pruebas
module.exports = app;

// ✅ Solo escucha si no estamos en pruebas
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`escuchando ${PORT}`));
}
