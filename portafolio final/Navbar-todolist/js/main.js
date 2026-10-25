/**
 * ============================================================================
 * CONTROLADOR DE NAVBAR + LISTA DE TAREAS (Navbar-todolist/js/main.js)
 * ============================================================================
 * Propósito: Gestionar la adición y eliminación de tareas dentro del layout con
 * barra lateral colapsable, mostrando una alerta Bootstrap (`.vacio`) cuando
 * el usuario intenta agregar una tarea en blanco.
 *
 * Corrección aplicada:
 * Se seleccionó específicamente `.container form input` para evitar colisionar
 * con el `<input type="search">` de la barra de navegación superior.
 */

const input = document.querySelector(".container form input") || document.querySelector("input");
const addBtn = document.querySelector(".btn-add");
const ul = document.querySelector(".ul-todo");
const empty = document.querySelector(".empty");
const error = document.querySelector(".vacio");

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
    error.classList.add("vacio");
  } else {
    // Muestra la alerta de error si el campo está vacío
    error.classList.remove("vacio");
  }
});

// Oculta la alerta de error al enfocar nuevamente el campo de texto
input.addEventListener("focus", () => {
  error.classList.add("vacio");
});

/**
 * Crea el botón para eliminar una tarea individual y verifica si la lista queda vacía.
 * @returns {HTMLButtonElement}
 */
function addDeleteBtn() {
  const deleteBtn = document.createElement("button");

  deleteBtn.textContent = "X";
  deleteBtn.className = "btn-delete";

  deleteBtn.addEventListener("click", (e) => {
    const item = e.target.parentElement;
    ul.removeChild(item);

    const items = ul.querySelectorAll("li");

    if (items.length === 0) {
      empty.style.display = "block";
    }
  });

  return deleteBtn;
}
