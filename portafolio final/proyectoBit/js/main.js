/**
 * ============================================================================
 * MÓDULO DE LISTA DE TAREAS (proyectoBit/js/main.js)
 * ============================================================================
 * Propósito: Gestionar las tareas rápidas de "Procrastination Nightmare",
 * asignando un ID aleatorio (`task0` - `task999`) a cada elemento `<li>` y
 * validando entradas vacías.
 *
 * Corrección aplicada:
 * Se corrigió la condición `if(empty.length=1)` (que usaba asignación `=` sobre
 * una propiedad inexistente de un HTMLElement) por una verificación válida de
 * lista vacía.
 */

const input = document.querySelector(".f-input-task");
const addBtn = document.querySelector(".btn-add");
const ul = document.querySelector(".ul-todo");
const empty = document.querySelector(".empty");
const error = document.querySelector(".vacio");

addBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const text = input.value.trim();

  if (text !== "") {
    const li = document.createElement("li");
    li.setAttribute("id", `task${Math.floor(Math.random() * 1000)}`);
    const p = document.createElement("p");
    p.textContent = text;

    li.appendChild(p);
    li.appendChild(addDeleteBtn());
    ul.appendChild(li);

    p.className += "to-do-work ";
    li.className += "space-li ";

    input.value = "";
    empty.style.display = "none";
    error.classList.add("vacio");
  } else {
    error.classList.remove("vacio");
  }
});

// Mostrar el mensaje de lista vacía al iniciar si no hay tareas
if (ul && ul.children.length === 0 && empty) {
  empty.style.display = "block";
}

input.addEventListener("focus", () => {
  error.classList.add("vacio");
});

/**
 * Crea el botón "X" para eliminar la tarea seleccionada del DOM.
 * @returns {HTMLButtonElement}
 */
function addDeleteBtn() {
  const deleteBtn = document.createElement("button");

  deleteBtn.textContent = "X";
  deleteBtn.className = "btn-delete";

  deleteBtn.addEventListener("click", (e) => {
    const item = e.target.parentElement;
    ul.removeChild(item);

    const items = document.querySelectorAll(".space-li");

    if (items.length === 0) {
      empty.style.display = "block";
    }
  });

  return deleteBtn;
}
