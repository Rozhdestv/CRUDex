/*routes/v1/planificaciones.js*/
"use strict";
const express = require("express");
const router = express.Router();
const {
  guardarPlanificacion,
  obtenerPlanificaciones,
  eliminarPlanificacion,
  actualizarPlanificacion,
} = require("../../controllers/planificacionesController");
const authMiddleware = require("../../middlewares/authMiddleware");
const checkPermiso = require("../../middlewares/checkPermiso");

router.use(authMiddleware);

router.post("/", checkPermiso("planificacion", "crear"), guardarPlanificacion);
router.get("/", checkPermiso("planificacion", "leer"), obtenerPlanificaciones);
router.delete(
  "/:id",
  checkPermiso("planificacion", "eliminar"),
  eliminarPlanificacion,
);
router.put(
  "/:id",
  checkPermiso("planificacion", "editar"),
  actualizarPlanificacion,
);

module.exports = router;
