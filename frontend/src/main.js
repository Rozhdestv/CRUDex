/* frontend/src/main.js */
"use strict";
import { login, logout, getCurrentUser } from "./api/authAPI";
import {
  crearPlanificacion,
  obtenerPlanificaciones,
  eliminarPlanificacion,
  actualizarPlanificacion,
} from "./api/planificacionesAPI";

import { renderPlanificaciones } from "./components/renderPlanificaciones";

let currentUser = null;

const loginSection = document.getElementById("loginSection");
const mainApp = document.getElementById("mainApp");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginError = document.getElementById("loginError");

const form = document.getElementById("formPlan");
const modal = document.getElementById("modalEditar");
const formEditar = document.getElementById("formEditar");
const editId = document.getElementById("editId");
const editTema = document.getElementById("editTema");
const editDesc = document.getElementById("editDesc");
const btnCerrar = document.getElementById("btnCerrar");

async function checkSession() {
  const user = await getCurrentUser();
  if (user) {
    currentUser = user;
    loginSection.style.display = "none";
    mainApp.style.display = "block";
    cargarPlanificaciones();
  } else {
    loginSection.style.display = "block";
    mainApp.style.display = "none";
  }
}

async function handleLogin() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  try {
    const res = await login(username, password);
    currentUser = res.user;
    loginSection.style.display = "none";
    mainApp.style.display = "block";
    cargarPlanificaciones();
  } catch (err) {
    loginError.textContent = err.message;
  }
}

async function handleLogout() {
  await logout();
  currentUser = null;
  loginSection.style.display = "block";
  mainApp.style.display = "none";
  document.getElementById("loginUsername").value = "";
  document.getElementById("loginPassword").value = "";
  loginError.textContent = "";
}

const cargarPlanificaciones = async () => {
  const response = await obtenerPñanificaciones();
  const data = Array.isArray(response.data) ? response.data : [];
  renderPlanificaciones(data, editar, eliminar);
};

const cargarPlanificaciones = async () => {
  const response = await obtenerPlanificaciones();
  const data = Array.isArray(response.data) ? response.data : [];
  renderPlanificaciones(data, editar, eliminar);
};

const editar = async (id, temaActual, descActual) => {
  editId.value = id;
  editTema.value = temaActual;
  editDesc.value = descActual;
  modal.showModal();
};

const eliminar = async (id) => {
  try {
    await eliminarPlanificacion(id);
    cargarPlanificaciones();
  } catch (error) {
    alert(error.message);
  }
};

formEditar.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = editId.value;
  const tema = editTema.value;
  const descripcion = editDesc.value;
  if (!tema || !descripcion) return alert("Tema y descripción son requeridos");
  try {
    await actualizarPlanificacion(id, tema, descripcion);
    modal.close();
    formEditar.reset();
    cargarPlanificaciones();
  } catch (error) {
    alert(error.message);
  }
});

btnCerrar.addEventListener("click", () => {
  modal.close();
  formEditar.reset();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const tema = document.getElementById("tema").value;
  const descripcion = document.getElementById("descripcion").value;
  if (!tema || !descripcion) return alert("Tema y descripción son requeridos");
  try {
    await crearPlanificacion(tema, descripcion);
    form.reset();
    cargarPlanificaciones();
  } catch (error) {
    alert(error.message);
  }
});

loginBtn.addEventListener("click", handleLogin);
logoutBtn.addEventListener("click", handleLogout);

checkSession();
