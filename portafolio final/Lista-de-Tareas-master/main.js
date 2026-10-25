/**
 * ============================================================================
 * GESTOR DE LISTA DE TAREAS (Lista-de-Tareas-master/main.js)
 * ============================================================================
 * Propósito: Capturar tareas desde el formulario, crear nodos `<li>` y `<p>`
 * dinámicamente en el DOM, adjuntar un botón de eliminación individual (`X`) y
 * alternar el mensaje de estado vacío (`.empty`).
 */

const input = document.querySelector("input");
const addBtn = document.querySelector(".btn-add");
const ul = document.querySelector("ul");
const empty = document.querySelector(".empty");

// Evento para agregar una nueva tarea a la lista
addBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const text = input.value.trim();

  if (text !== "") {
    const li = document.createElement("li");
    const p = document.createElement("p");
    p.textContent = text;

    li.appendChild(p);
    li.appendChild(addDeleteBtn());
    ul.appendChild(li);

    input.value = "";
    empty.style.display = "none";
  }
});

/**
 * Crea un botón de borrado ("X") con su propio listener para eliminar la fila padre.
 * @returns {HTMLButtonElement}
 */
function addDeleteBtn() {
  const deleteBtn = document.createElement("button");

  deleteBtn.textContent = "X";
  deleteBtn.className = "btn-delete";

  deleteBtn.addEventListener("click", (e) => {
    const item = e.target.parentElement;
    ul.removeChild(item);

    const items = document.querySelectorAll("li");

    // Si ya no quedan tareas en la lista, volvemos a mostrar el indicador vacío
    if (items.length === 0) {
      empty.style.display = "block";
    }
  });

  return deleteBtn;
}
