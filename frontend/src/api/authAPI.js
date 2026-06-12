// src/api/authAPI.js
"use strict";
const API_AUTH = "http://localhost:3000/auth/v1";

export const login = async (username, password) => {
  const res = await fetch(`${API_AUTH}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Error desconocido");
  }
  return res.json();
};

export const logout = async () => {
  const res = await fetch(`${API_AUTH}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al cerrar sesión");
  return res.json();
};

export const getCurrentUser = async () => {
  const res = await fetch(`${API_AUTH}/me`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.user;
};
