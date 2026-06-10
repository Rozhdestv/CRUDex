// tests/unit/validators.test.js
const {
  validarPlanificacion,
} = require("../../controllers/planificacionesController");
const { body } = require("express-validator");

test("validarPlanificacion rechaza tema vacío", async () => {
  const req = { body: { tema: "", descripcion: "brr" } };
});
