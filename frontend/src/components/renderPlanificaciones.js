/* frontend/src/components/renderPlanificaciones.js */
"use strict";
export const renderPlanificaciones = (data, editar, eliminar) => {
  const temasLista = document.getElementById("temasLista");
  temasLista.innerHTML = "";
  data.forEach((plan) => {
    const li = document.createElement("li");
    li.textContent = `${plan.tema}: ${plan.descripcion}`;
    /*BOTON EDITAR*/
    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.dataset.id = plan.id;
    btnEditar.addEventListener("click", (event) => {
      const id = event.target.dataset.id;
      editar(id, plan.tema, plan.descripcion);
    });

    /*BOTON ELIMINAR*/
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.dataset.id = plan.id;
    btnEliminar.addEventListener("click", (event) => {
      const id = event.target.dataset.id;
      eliminar(id);
    });

    li.appendChild(btnEditar);
    li.appendChild(btnEliminar);
    temasLista.appendChild(li);
  });
};
