//src/services/authService.test.js
const authService = require("./authService");
const usuarioRepository = require("../repositories/usuarioRepository");

// Mockear el repositorio para no tocar BD real
jest.mock("../repositories/usuarioRepository");

describe("AuthService - login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debe retornar error si usuario no existe", async () => {
    usuarioRepository.findByUsername.mockResolvedValue(null);

    const result = await authService.login("inexistente", "cualquier");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Credenciales inválidas");
    expect(usuarioRepository.findByUsername).toHaveBeenCalledWith(
      "inexistente",
    );
  });

  test("debe retornar usuario si credenciales correctas", async () => {
    const mockUser = {
      id: 1,
      username: "admin",
      email: "admin@test.com",
      password_hash: "$2b$10$hashed",
      nombre: "Admin",
      activo: true,
    };
    usuarioRepository.findByUsername.mockResolvedValue(mockUser);
    const bcrypt = require("bcrypt");
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

    const result = await authService.login("admin", "correcta");

    expect(result.success).toBe(true);
    expect(result.user.username).toBe("admin");
  });
});
