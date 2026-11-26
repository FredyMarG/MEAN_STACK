/**
 * ============================================================================
 * ARCHIVO: habitos.js (proyectoBit/js/habitos.js)
 * DESCRIPCIÓN: Controlador interactivo para el Tracker Semanal de Hábitos
 *              en Procrastination Nightmare (`habitos.html`).
 * FUNCIONALIDADES:
 *   1. Marca o desmarca cualquier día (Lunes a Domingo) en la matriz semanal.
 *   2. Calcula y muestra en tiempo real el porcentaje de cumplimiento semanal.
 *   3. Permite agregar hábitos leyendo nombre, meta/cantidad/tiempo y descripción.
 *   4. Permite eliminar hábitos existentes mediante botón `×`.
 *   5. Persiste hábitos y marcas diarias en `localStorage` (`proyectoBit_habitos_v1`).
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "proyectoBit_habitos_v1";
  const weekContainer = document.querySelector(".N-week_contenedor > div");
  if (!weekContainer) return;

  /** Escapa caracteres HTML para renderizado seguro en `innerHTML`. */
  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }

  // Crear indicador visual de progreso semanal en la cabecera de la matriz
  const headerBar = document.querySelector(".N-week .bg-white.rounded-1");
  let progressBadge = document.getElementById("habit-progress-badge");
  if (headerBar && !progressBadge) {
    progressBadge = document.createElement("span");
    progressBadge.id = "habit-progress-badge";
    progressBadge.className = "badge rounded-pill align-self-center me-3 px-3 py-2";
    progressBadge.style.backgroundColor = "#a56ef3";
    progressBadge.style.fontSize = "0.85rem";
    headerBar.appendChild(progressBadge);
  }

  /** Extrae los hábitos iniciales del HTML si aún no existen en `localStorage`. */
  function extractInitialHabitsFromDOM() {
    const rows = Array.from(weekContainer.querySelectorAll(".row")).slice(1);
    const list = [];
    rows.forEach((row) => {
      const name = row.children[0]?.textContent.trim() || "";
      if (name && name !== "...") {
        const days = [];
        for (let i = 1; i <= 7; i++) {
          days.push(Boolean(row.children[i]?.querySelector(".fa-check")));
        }
        list.push({ name, meta: name, days });
      }
    });
    return list;
  }

  /** Carga los hábitos desde `localStorage` o usa los iniciales del DOM. */
  function loadHabits() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return extractInitialHabitsFromDOM();
  }

  let habits = loadHabits();

  /** Guarda la matriz de hábitos en `localStorage`. */
  function saveHabits() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch {}
  }

  /** Recalcula el porcentaje semanal de días completados sobre el total posible. */
  function updateProgress() {
    const activeRows = habits.length;
    const totalChecks = habits.reduce((acc, h) => acc + h.days.filter(Boolean).length, 0);
    const totalPossible = activeRows * 7;
    const pct = totalPossible > 0 ? Math.round((totalChecks / totalPossible) * 100) : 0;
    if (progressBadge) {
      progressBadge.textContent = `Progreso semanal: ${totalChecks}/${totalPossible} (${pct}%)`;
    }
  }

  /** Reconstruye las filas de hábitos manteniendo la cabecera de días intacta. */
  function renderHabits() {
    const headerRow = weekContainer.querySelector(".row");
    weekContainer.innerHTML = "";
    if (headerRow) weekContainer.appendChild(headerRow);

    habits.forEach((habit, hIdx) => {
      const row = document.createElement("div");
      row.className = "row";

      const nameCell = document.createElement("div");
      nameCell.className = "N-week_rectangle text-dark fw-semibold border-bottom border-end col pt-2 d-flex align-items-center justify-content-between gap-1";
      nameCell.title = habit.meta || habit.name;
      nameCell.innerHTML = `
        <span class="d-flex align-items-center gap-1 text-truncate" style="max-width: 78%;">
          <i class="fa-solid fa-star ps-1" style="color: #a56ef3;"></i>
          <span class="text-truncate" style="font-size: 0.78rem;">${escapeHtml(habit.name)}</span>
        </span>
        <button type="button" class="btn btn-sm p-0 text-danger fw-bold delete-habit-btn" data-index="${hIdx}" title="Eliminar hábito" style="line-height:1;">×</button>
      `;
      row.appendChild(nameCell);

      for (let dIdx = 0; dIdx < 7; dIdx++) {
        const cell = document.createElement("div");
        cell.className = "N-week_rectangle text-white fw-semibold border-bottom border-end col text-center pt-2";
        cell.style.cursor = "pointer";
        cell.title = "Haz clic para marcar o desmarcar este día";
        cell.dataset.habit = String(hIdx);
        cell.dataset.day = String(dIdx);
        if (habit.days[dIdx]) {
          cell.innerHTML = '<i class="fa-solid fa-check fa-lg" style="color: #00E096;"></i>';
        }
        row.appendChild(cell);
      }

      weekContainer.appendChild(row);
    });

    updateProgress();
  }

  // Delegación de clics para alternar días o eliminar un hábito
  weekContainer.addEventListener("click", (e) => {
    const delBtn = e.target.closest(".delete-habit-btn");
    if (delBtn) {
      const idx = Number(delBtn.dataset.index);
      habits.splice(idx, 1);
      saveHabits();
      renderHabits();
      return;
    }

    const dayCell = e.target.closest("[data-habit][data-day]");
    if (dayCell) {
      const hIdx = Number(dayCell.dataset.habit);
      const dIdx = Number(dayCell.dataset.day);
      if (habits[hIdx]) {
        habits[hIdx].days[dIdx] = !habits[hIdx].days[dIdx];
        saveHabits();
        renderHabits();
      }
    }
  });

  /** Agrega un nuevo hábito marcando el Lunes como día inicial. */
  function addNewHabit(name, metaText) {
    const cleanName = name.trim();
    if (!cleanName) {
      alert("Por favor escribe el nombre del hábito que deseas registrar.");
      return;
    }
    habits.push({
      name: cleanName,
      meta: metaText || cleanName,
      days: [true, false, false, false, false, false, false]
    });
    saveHabits();
    renderHabits();
  }

  // Conectar ambos formularios laterales (Cantidad y Cronómetro)
  document.querySelectorAll(".N-aside_input").forEach((btn) => {
    btn.style.cursor = "pointer";
    btn.addEventListener("click", () => {
      const section = btn.closest("section");
      if (!section) return;
      const habitInput = section.querySelector('input[placeholder="Habito"]');
      const selectCond = section.querySelector("select")?.selectedOptions[0]?.textContent.trim() || "";
      const qtyInput = section.querySelector('input[type="number"]');
      const timeInput = section.querySelector('input[type="time"]');
      const descArea = section.querySelector("textarea");

      const name = habitInput ? habitInput.value : "";
      const goalDetail = qtyInput?.value
        ? `${selectCond} ${qtyInput.value}`
        : timeInput?.value
        ? `${selectCond} ${timeInput.value}`
        : selectCond;
      const meta = [goalDetail, descArea?.value.trim()].filter(Boolean).join(" — ");

      addNewHabit(name, meta);
      if (habitInput) habitInput.value = "";
      if (qtyInput) qtyInput.value = "";
      if (descArea) descArea.value = "";
    });
  });

  // Botón rápido inferior `.N-week_input`
  const quickAddBtn = document.querySelector(".N-week_input");
  if (quickAddBtn) {
    quickAddBtn.style.cursor = "pointer";
    quickAddBtn.addEventListener("click", () => {
      const name = window.prompt("Nombre del nuevo hábito:");
      if (name) addNewHabit(name, "");
    });
  }

  renderHabits();
});
