//src/backend/tests/unit/auditService.test.js
"use strict";
const auditService = require("../../src/services/auditService");
const pool = require("../../src/config/db");

jest.mock("../../src/config/db", () => ({
  query: jest.fn(),
}));

describe("auditService", () => {
  afterEach(() => jest.clearAllMocks());

  test("registrarLog con detalle null", async () => {
    pool.query.mockResolvedValue({});
    await auditService.registrarLog(
      1,
      "login_exitoso",
      "127.0.0.1",
      "Mozilla",
      null,
    );
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [
      1,
      "login_exitoso",
      "127.0.0.1",
      "Mozilla",
      null,
    ]);
  });

  test("registrarLog con detalle no null", async () => {
    pool.query.mockResolvedValue({});
    const detalle = { key: "value" };
    await auditService.registrarLog(1, "accion", null, null, detalle);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [
      1,
      "accion",
      null,
      null,
      JSON.stringify(detalle),
    ]);
  });
});
