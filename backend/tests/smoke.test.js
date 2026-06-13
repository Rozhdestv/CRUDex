// tests/smoke.test.js
const request = require("supertest");
const app = require("../app");

test("La app responde en /health", async () => {
  const res = await request(app).get("/health");
  expect(res.status).toBe(200);
});
