//src/backend/tests/unit/planificacionService.test.js
"use strict";
const planificacionService = require("../../src/services/planificacionService");
const planificacionRepository = require("../../src/repositories/planificacionRepository");

jest.mock("../../src/repositories/planificacionRepository");

describe("planificacionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("crearPlanificacion", () => {
    test("debe crear con datos válidos", async () => {
      planificacionRepository.crear.mockResolvedValue({ id: 1 });
      const result = await planificacionService.crearPlanificacion(
        "Tema",
        "Desc",
      );
      expect(result).toEqual({ id: 1 });
      expect(planificacionRepository.crear).toHaveBeenCalledWith(
        "Tema",
        "Desc",
      );
    });

    test("debe rechazar tema vacío", async () => {
      await expect(
        planificacionService.crearPlanificacion("", "Desc"),
      ).rejects.toThrow("Tema requiere 1-25 caracteres");
      expect(planificacionRepository.crear).not.toHaveBeenCalled();
    });

    test("debe rechazar tema muy largo", async () => {
      await expect(
        planificacionService.crearPlanificacion("a".repeat(26), "Desc"),
      ).rejects.toThrow("Tema requiere 1-25 caracteres");
    });

    test("debe rechazar descripción vacía", async () => {
      await expect(
        planificacionService.crearPlanificacion("Tema", ""),
      ).rejects.toThrow("Descripción requiere 1-25 caracteres");
    });
  });

  describe("listarPlanificaciones", () => {
    test("devuelve datos paginados", async () => {
      const mockData = [{ id: 1, tema: "A", descripcion: "B" }];
      planificacionRepository.obtenerTodos.mockResolvedValue(mockData);
      planificacionRepository.obtenerTotal.mockResolvedValue(1);

      const result = await planificacionService.listarPlanificaciones(1, 10);
      expect(result.data).toEqual(mockData);
      expect(result.pagination).toEqual({ page: 1, total: 1, pages: 1 });
      expect(planificacionRepository.obtenerTodos).toHaveBeenCalledWith(10, 0);
    });
  });

  describe("actualizarPlanificacion", () => {
    test("actualiza con datos válidos", async () => {
      planificacionRepository.actualizar.mockResolvedValue({ rowCount: 1 });
      await planificacionService.actualizarPlanificacion(
        1,
        "Nuevo",
        "NuevaDesc",
      );
      expect(planificacionRepository.actualizar).toHaveBeenCalled();
    });

    test("rechaza ID inválido", async () => {
      await expect(
        planificacionService.actualizarPlanificacion("abc", "Tema", "Desc"),
      ).rejects.toThrow("ID inválido");
    });
  });

  describe("eliminarPlanificacion", () => {
    test("elimina con ID válido", async () => {
      planificacionRepository.eliminarPorId.mockResolvedValue({ rowCount: 1 });
      const result = await planificacionService.eliminarPlanificacion(1);
      expect(result).toBe(true);
    });

    test("rechaza ID inválido", async () => {
      await expect(
        planificacionService.eliminarPlanificacion("abc"),
      ).rejects.toThrow("ID inválido");
    });
  });
});
