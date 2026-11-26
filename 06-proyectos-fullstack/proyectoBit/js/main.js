/**
 * ============================================================================
 * MÓDULO DE LISTA DE TAREAS (proyectoBit/js/main.js)
 * ============================================================================
 * Propósito: Gestionar las tareas rápidas de "Procrastination Nightmare" con
 * persistencia en `localStorage`, delegación de eventos en `<ul>`, marcado de
 * completado, contador de pendientes y validación de entradas vacías.
 */

(() => {
  const input = document.querySelector(".f-input-task");
  const addBtn = document.querySelector(".btn-add");
  const ul = document.querySelector(".ul-todo");
  const empty = document.querySelector(".empty");
  const error = document.querySelector(".vacio");
  const countBadge = document.querySelector("#todoCountBadge");
  const clearCompletedBtn = document.querySelector("#btnClearCompleted");

  if (!input || !addBtn || !ul) return;

  const STORAGE_KEY = "proyectoBit_todos_v1";

  /**
   * Lee el arreglo de tareas desde `localStorage` protegiendo contra JSON inválido.
   * @returns {Array<{ id: number, text: string, done: boolean }>}
   */
  function loadTasks() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  let tasks = loadTasks();

  /** Persiste el estado actual de `tasks` en `localStorage`. */
  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  /**
   * Renderiza todas las tareas usando `DocumentFragment` para minimizar reflujos
   * del DOM y actualiza el contador de pendientes.
   */
  function renderTasks() {
    ul.innerHTML = "";
    if (countBadge) {
      const pending = tasks.filter((t) => !t.done).length;
      countBadge.textContent = `${pending} ${pending === 1 ? "pendiente" : "pendientes"}`;
    }
    if (tasks.length === 0) {
      if (empty) empty.style.display = "block";
      return;
    }
    if (empty) empty.style.display = "none";

    const frag = document.createDocumentFragment();
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = "space-li";
      li.dataset.id = String(task.id);

      const p = document.createElement("p");
      p.className = "to-do-work";
      p.textContent = task.text; // textContent previene XSS
      p.style.cursor = "pointer";
      if (task.done) {
        p.style.textDecoration = "line-through";
        p.style.opacity = "0.6";
      }

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.textContent = "X";
      deleteBtn.className = "btn-delete";
      deleteBtn.setAttribute("aria-label", "Eliminar tarea");

      li.appendChild(p);
      li.appendChild(deleteBtn);
      frag.appendChild(li);
    });
    ul.appendChild(frag);
  }

  // Alta de tarea con validación de entrada vacía
  addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const text = input.value.trim();

    if (text !== "") {
      tasks.push({ id: Date.now(), text, done: false });
      saveTasks();
      renderTasks();
      input.value = "";
      if (error) error.classList.add("vacio");
    } else if (error) {
      error.classList.remove("vacio");
    }
  });

  // Delegación de eventos para completar (clic en texto) o eliminar (clic en X)
  ul.addEventListener("click", (e) => {
    const li = e.target.closest("li.space-li");
    if (!li) return;
    const id = Number(li.dataset.id);

    if (e.target.classList.contains("btn-delete")) {
      tasks = tasks.filter((t) => t.id !== id);
      saveTasks();
      renderTasks();
    } else if (e.target.classList.contains("to-do-work")) {
      tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      saveTasks();
      renderTasks();
    }
  });

  input.addEventListener("focus", () => {
    if (error) error.classList.add("vacio");
  });

  // Elimina todas las tareas marcadas como completadas en un solo clic
  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener("click", () => {
      tasks = tasks.filter((t) => !t.done);
      saveTasks();
      renderTasks();
    });
  }

  renderTasks();
})();
