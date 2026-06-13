//tests/integration/auth.test.js
"use strict";
const request = require("supertest");
const app = require("../../app"); // ← corregido (sin /src)

describe("POST /auth/v1/login", () => {
  test("retorna 401 si credenciales inválidas", async () => {
    const response = await request(app)
      .post("/auth/v1/login")
      .send({ username: "mal", password: "mal" })
      .expect(401);
    expect(response.body.success).toBe(false);
  });

  test("retorna 200 y usuario si credenciales correctas", async () => {
    const response = await request(app)
      .post("/auth/v1/login")
      .send({ username: "admin", password: "12345678" })
      .expect(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user).toHaveProperty("id");
  });
});

describe("GET /auth/v1/me", () => {
  let agent;

  beforeAll(async () => {
    agent = request.agent(app);
    await agent
      .post("/auth/v1/login")
      .send({ username: "admin", password: "12345678" });
  });

  test("devuelve usuario autenticado", async () => {
    const res = await agent.get("/auth/v1/me").expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user.username).toBe("admin");
  });

  test("retorna 401 sin sesión", async () => {
    const newAgent = request.agent(app);
    await newAgent.get("/auth/v1/me").expect(401);
  });
});

describe("POST /auth/v1/logout", () => {
  test("destruye sesión", async () => {
    const agent = request.agent(app);
    await agent
      .post("/auth/v1/login")
      .send({ username: "admin", password: "12345678" })
      .expect(200);
    await agent.post("/auth/v1/logout").expect(200);
    await agent.get("/auth/v1/me").expect(401);
  });
});
