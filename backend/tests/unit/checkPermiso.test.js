// tests/unit/checkPermiso.test.js
const checkPermiso = require("../../src/middlewares/checkPermiso");
const {
  verificarPermisoUsuario,
} = require("../../src/services/permissionService");

jest.mock("../../src/services/permissionService");

describe("Middleware checkPermiso", () => {
  let req, res, next;

  beforeEach(() => {
    req = { session: { user: { id: 1 } } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  test("debe llamar next() si tiene permiso", async () => {
    verificarPermisoUsuario.mockResolvedValue(true);

    await checkPermiso("planificacion", "leer")(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test("debe retornar 403 si no tiene permiso", async () => {
    verificarPermisoUsuario.mockResolvedValue(false);

    await checkPermiso("planificacion", "eliminar")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Permiso denegado",
    });
  });
});
