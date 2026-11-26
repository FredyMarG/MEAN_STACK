/**
 * ============================================================================
 * GESTOR DE TAREAS EN NAVBAR-TODOLIST (Navbar-todolist/js/main.js)
 * ============================================================================
 * Propósito educativo (Curso MEAN Stack):
 * - Lista de tareas con persistencia segura en `localStorage`.
 * - Búsqueda de texto (`#filterTasksInput`) combinada con filtro por estado
 *   (`all`, `pending`, `done`), contador de pendientes y limpieza de completadas.
 * - Delegación de eventos sobre `<ul>` y renderizado seguro sin XSS.
 */

(() => {
  const STORAGE_KEY = "navbar_todolist_v1";
  const addForm = document.getElementById("addTaskForm");
  const input = document.getElementById("taskInput");
  const filterInput = document.getElementById("filterTasksInput");
  const ul = document.getElementById("tasksList");
  const empty = document.querySelector(".empty");
  const pendingBadge = document.getElementById("pendingBadge");
  const clearDoneBtn = document.getElementById("clearDoneBtn");
  const statusBtns = document.querySelectorAll(".filter-status-btn");

  if (!addForm || !input || !ul) return;

  let statusFilter = "all"; // Puede ser: "all" | "pending" | "done"

  /** Carga de forma segura las tareas guardadas en `localStorage`. */
  function loadTasks() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  let tasks = loadTasks();

  /** Persiste el arreglo `tasks` en `localStorage`. */
  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  /** Renderiza las tareas aplicando búsqueda y filtro de estado activos. */
  function renderTasks() {
    const q = (filterInput?.value || "").trim().toLowerCase();
    const pendingCount = tasks.filter((t) => !t.done).length;
    if (pendingBadge) {
      pendingBadge.textContent = `${pendingCount} ${pendingCount === 1 ? "pendiente" : "pendientes"}`;
    }

    const visibleTasks = tasks.filter((t) => {
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "pending" && !t.done) ||
        (statusFilter === "done" && t.done);
      const matchText = !q || t.text.toLowerCase().includes(q);
      return matchStatus && matchText;
    });

    ul.innerHTML = "";
    if (visibleTasks.length === 0) {
      if (empty) empty.style.display = "block";
      return;
    }
    if (empty) empty.style.display = "none";

    const frag = document.createDocumentFragment();
    visibleTasks.forEach((task) => {
      const li = document.createElement("li");
      li.dataset.id = String(task.id);

      const p = document.createElement("p");
      p.textContent = task.text;
      p.style.cursor = "pointer";
      if (task.done) {
        p.style.textDecoration = "line-through";
        p.style.opacity = "0.55";
      }

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.textContent = "×";
      deleteBtn.className = "btn-delete";
      deleteBtn.setAttribute("aria-label", "Eliminar tarea");

      li.appendChild(p);
      li.appendChild(deleteBtn);
      frag.appendChild(li);
    });
    ul.appendChild(frag);
  }

  // Agrega nueva tarea al enviar el formulario (botón + o tecla Enter)
  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    tasks.push({ id: Date.now(), text, done: false });
    saveTasks();
    renderTasks();
    input.value = "";
  });

  // Delegación de eventos en `<ul>` para eliminar o alternar completado
  ul.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    const id = Number(li.dataset.id);

    if (e.target.classList.contains("btn-delete")) {
      tasks = tasks.filter((t) => t.id !== id);
    } else if (e.target.tagName === "P") {
      tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    }
    saveTasks();
    renderTasks();
  });

  // Búsqueda en vivo desde la barra superior
  filterInput?.addEventListener("input", renderTasks);

  // Cambio de pestaña de estado (Todas / Pendientes / Completadas)
  statusBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      statusFilter = btn.dataset.status || "all";
      statusBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("btn-info", active);
        b.classList.toggle("text-dark", active);
        b.classList.toggle("fw-semibold", active);
        b.classList.toggle("btn-outline-secondary", !active);
        b.classList.toggle("text-light", !active);
      });
      renderTasks();
    });
  });

  // Elimina todas las tareas ya completadas
  clearDoneBtn?.addEventListener("click", () => {
    tasks = tasks.filter((t) => !t.done);
    saveTasks();
    renderTasks();
  });

  // Renderizado inicial
  renderTasks();
})();
