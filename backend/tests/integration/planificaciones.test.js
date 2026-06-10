// tests/integration/planificacinoes.test.js
const request = require("supertest");
const app = require("../../app");

describe("POST /planificaciones/v1", () => {
  test("crea planificacion con datos validos", async () => {
    const res = await request(app).post("/planificaciones/v1").send({
      tema: "Test",
      descripcion: "Desc",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
  test("rechaza tema muy largo", async () => {
    const res = await request(app)
      .post("/planificaciones/v1")
      .send({ tema: "a".repeat(26), descripcion: "Desc" });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
