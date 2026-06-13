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

// ✅ CORRECCIÓN DE HELMET Y CSP
app.use(
  helmet({
    // Activa y configura las políticas de seguridad de contenido
    contentSecurityPolicy: {
      useDefaults: false, // 👈 IMPORTANTE: Mantiene las opciones seguras por defecto de Helmet
      // Si descargas las fuentes de forma local, tu CSP queda blindado y ZAP se callará por completo:
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        connectSrc: ["'self'", "http://localhost:3000"],
        fontSrc: ["'self'", "data:"], // Ya no necesitas URLs externas
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        imgSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"], // 🔒 Sin 'unsafe-inline' en scripts (Perfecto)
        styleSrc: ["'self'"], // 🔒 ¡Quitamos 'unsafe-inline' porque las fuentes ya son locales!
      },
    },
    // 👈 Soluciona X-Content-Type-Options: nosniff (Evita que el navegador adivine el tipo de archivo)
    noSniff: true,
    // 👈 Doble protección contra ClickJacking para navegadores antiguos
    frameguard: { action: "deny" },
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 solicitudes por IP
  message: "Demasiadas peticiones intente mas tarde",
});
app.use(limiter);
// app.set('trust proxy', 1); // si estás detrás de un proxy
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
const setAuditUser = require("./src/middlewares/setAuditUser");

app.use(express.json());
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
app.use(express.static(path.join(__dirname, "../frontend/public")));
app.use("/auth/v1", setAuditUser, require("./src/routes/v1/auth"));
app.use(
  "/planificaciones/v1",
  setAuditUser,
  require("./src/routes/v1/planificaciones"),
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// 🛠️ (Manejador de error 404 personalizado para controlar las cabeceras)
app.use((req, res, next) => {
  // Forzamos manualmente que la respuesta de error lleve tu CSP estricta
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; base-uri 'self'; connect-src 'self' http://localhost:3000; font-src 'self' data:; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self'; style-src 'self';",
  );
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");

  // Respondemos con un estado 404 limpio en formato JSON o texto
  res.status(404).json({
    status: 404,
    message: "La ruta solicitada no existe.",
  });
});

// ✅ Exporta la app para pruebas
module.exports = app;
