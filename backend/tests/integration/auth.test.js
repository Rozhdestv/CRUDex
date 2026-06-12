//tests/integration/auth.test.js
"use strict";
const request = require("supertest");
const app = require("../../src/app");

describe("POST /auth/v1/login", () => {
  test("retorna 401 si credenciales inválidas", async () => {
    const response = await request(app)
      .post("/auth/v1/login")
      .send({ username: "mal", password: "mal" })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Credenciales inválidas");
  });

  test("retorna 200 y usuario si credenciales correctas", async () => {
    const response = await request(app)
      .post("/auth/v1/login")
      .send({ username: "admin", password: "12345678" })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user.password).toBeUndefined(); // no  exponer password
  });
});
