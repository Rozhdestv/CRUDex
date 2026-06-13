// tests/integration/planificaciones.test.js
"use strict";
const request = require("supertest");
const app = require("../../app");

describe("Planificaciones API", () => {
  let agent;

  beforeAll(async () => {
    agent = request.agent(app);
    await agent
      .post("/auth/v1/login")
      .send({ username: "admin", password: "12345678" })
      .expect(200);
  });

  describe("POST /planificaciones/v1", () => {
    test("crea planificacion con datos validos", async () => {
      const res = await agent
        .post("/planificaciones/v1")
        .set("Content-Type", "application/json")
        .send({ tema: "Test", descripcion: "Desc" })
        .expect(200);
      expect(res.body.success).toBe(true);
    });

    test("rechaza tema muy largo", async () => {
      const res = await agent
        .post("/planificaciones/v1")
        .set("Content-Type", "application/json")
        .send({ tema: "a".repeat(26), descripcion: "Desc" })
        .expect(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /planificaciones/v1", () => {
    test("devuelve lista paginada", async () => {
      const res = await agent
        .get("/planificaciones/v1?page=1&limit=5")
        .expect(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toHaveProperty("total");
    });
  });

  describe("PUT /planificaciones/v1/:id", () => {
    let planificacionId;

    beforeAll(async () => {
      const res = await agent
        .post("/planificaciones/v1")
        .set("Content-Type", "application/json")
        .send({ tema: "ParaActualizar", descripcion: "Original" })
        .expect(200);
      planificacionId = res.body.data?.id;
    });

    test("actualiza planificación existente", async () => {
      const res = await agent
        .put(`/planificaciones/v1/${planificacionId}`)
        .set("Content-Type", "application/json")
        .send({ tema: "Actualizado", descripcion: "Nueva" })
        .expect(200);
      expect(res.body.success).toBe(true);
    });

    test("rechaza datos inválidos", async () => {
      await agent
        .put(`/planificaciones/v1/${planificacionId}`)
        .send({ tema: "", descripcion: "" })
        .expect(400);
    });
  });

  describe("DELETE /planificaciones/v1/:id", () => {
    let planificacionId;

    beforeAll(async () => {
      const res = await agent
        .post("/planificaciones/v1")
        .set("Content-Type", "application/json")
        .send({ tema: "ParaEliminar", descripcion: "Temp" })
        .expect(200);
      planificacionId = res.body.data?.id;
    });

    test("elimina planificación existente", async () => {
      await agent.delete(`/planificaciones/v1/${planificacionId}`).expect(200);
    });

    test("devuelve 404 si ID no existe", async () => {
      await agent.delete("/planificaciones/v1/999999").expect(404);
    });
  });
});
