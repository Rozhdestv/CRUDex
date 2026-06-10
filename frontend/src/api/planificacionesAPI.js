/*frontend/src/api/planificacionesAPI.js*/
"use strict";

const API = "http://localhost:3000/planificaciones/v1";

export const obtenerPlanificaciones = async () => {
  const respuesta = await fetch(API, { credentials: "include" });
  // incluye cookie de sesion credentials include
  return await respuesta.json();
};

export const crearPlanificacion = async (tema, descripcion) => {
  const respuesta = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // incluye cookie de sesion
    body: JSON.stringify({ tema, descripcion }),
  });
  if (!respuesta.ok) {
    const error = await respuesta.json();
    throw new Error(error.message || error.errors);
  }
};

export const eliminarPlanificacion = async (id) => {
  const respuesta = await fetch(`${API}/${id}`, {
    method: "DELETE",
    credentials: "include", // incluye cookie de sesion
  });
  if (!respuesta.ok) {
    const error = await respuesta.json();
    throw new Error(error.message || error.errors);
  }
};

export const actualizarPlanificacion = async (id, tema, descripcion) => {
  const respuesta = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // incluye cookie de sesion
    body: JSON.stringify({ tema, descripcion }),
  });
  if (!respuesta.ok) {
    const error = await respuesta.json();
    throw new Error(error.message || error.errors);
  }
};
