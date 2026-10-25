/**
 * ============================================================================
 * ARCHIVO: habitos.js (proyectoBit/js/habitos.js)
 * DESCRIPCIÓN: Controlador interactivo para el módulo Tracker Semanal de
 *              Hábitos en Procrastination Nightmare (`habitos.html`).
 * FUNCIONALIDADES:
 *   1. Permite marcar o desmarcar cualquier celda de día (Lunes a Domingo)
 *      haciendo clic sobre ella en la matriz semanal de hábitos.
 *   2. Calcula y muestra en tiempo real el porcentaje de cumplimiento semanal.
 *   3. Permite registrar nuevos hábitos desde los formularios laterales
 *      ("Define tu hábito | Cantidad" y "Define tu hábito | Cronómetro") o
 *      desde el botón rápido inferior, actualizando la tabla al instante.
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const weekContainer = document.querySelector(".N-week_contenedor > div");
  if (!weekContainer) return;

  // Crear indicador visual de progreso semanal en la cabecera de fecha
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

  function updateProgress() {
    const rows = Array.from(weekContainer.querySelectorAll(".row")).slice(1);
    let activeRows = 0;
    let totalChecks = 0;

    rows.forEach((row) => {
      const firstCol = row.children[0];
      if (!firstCol) return;
      const isPlaceholder = firstCol.textContent.trim() === "...";
      if (!isPlaceholder) {
        activeRows++;
        for (let i = 1; i < row.children.length; i++) {
          if (row.children[i].querySelector(".fa-check")) {
            totalChecks++;
          }
        }
      }
    });

    const totalPossible = activeRows * 7;
    const pct = totalPossible > 0 ? Math.round((totalChecks / totalPossible) * 100) : 0;
    if (progressBadge) {
      progressBadge.textContent = `Progreso semanal: ${totalChecks}/${totalPossible} (${pct}%)`;
    }
  }

  // Hacer interactivas todas las celdas de Lunes a Domingo
  function bindRowCells(row) {
    const cells = row.children;
    for (let i = 1; i < cells.length; i++) {
      const cell = cells[i];
      cell.style.cursor = "pointer";
      cell.classList.add("text-center", "pt-2");
      cell.title = "Haz clic para marcar o desmarcar este día";

      if (!cell.dataset.bound) {
        cell.dataset.bound = "true";
        cell.addEventListener("click", () => {
          const existingIcon = cell.querySelector(".fa-check");
          if (existingIcon) {
            cell.innerHTML = "";
          } else {
            cell.innerHTML = '<i class="fa-solid fa-check fa-lg" style="color: #00E096;"></i>';
          }
          updateProgress();
        });
      }
    }
  }

  const allRows = Array.from(weekContainer.querySelectorAll(".row")).slice(1);
  allRows.forEach(bindRowCells);
  updateProgress();

  // Función para insertar un nuevo hábito en la primera fila disponible (`...`) o al final
  function addNewHabit(name, metaText) {
    const cleanName = name.trim();
    if (!cleanName) {
      alert("Por favor escribe el nombre del hábito que deseas registrar.");
      return;
    }

    const rows = Array.from(weekContainer.querySelectorAll(".row")).slice(1);
    let targetRow = rows.find((r) => r.children[0] && r.children[0].textContent.trim() === "...");

    if (!targetRow) {
      targetRow = document.createElement("div");
      targetRow.className = "row";
      targetRow.innerHTML = `
        <div class="N-week_rectangle text-white fw-semibold border-bottom border-end col pt-2"></div>
        <div class="N-week_rectangle text-white fw-semibold border-bottom border-end col text-center pt-2"></div>
        <div class="N-week_rectangle text-white fw-semibold border-bottom border-end col text-center pt-2"></div>
        <div class="N-week_rectangle text-white fw-semibold border-bottom border-end col text-center pt-2"></div>
        <div class="N-week_rectangle text-white fw-semibold border-bottom border-end col text-center pt-2"></div>
        <div class="N-week_rectangle text-white fw-semibold border-bottom border-end col text-center pt-2"></div>
        <div class="N-week_rectangle text-white fw-semibold border-bottom border-end col text-center pt-2"></div>
        <div class="N-week_rectangle text-white fw-semibold border-bottom col text-center pt-2"></div>
      `;
      weekContainer.appendChild(targetRow);
      bindRowCells(targetRow);
    }

    const firstCell = targetRow.children[0];
    firstCell.className = "N-week_rectangle text-dark fw-semibold border-bottom border-end col pt-2 d-flex align-items-center gap-1";
    firstCell.title = metaText || cleanName;
    firstCell.innerHTML = `
      <i class="fa-solid fa-star ps-1" style="color: #a56ef3;"></i>
      <span class="text-truncate" style="font-size: 0.78rem; max-width: 70px;">${cleanName}</span>
    `;
    // Marcar el primer día como iniciado
    if (targetRow.children[1]) {
      targetRow.children[1].innerHTML = '<i class="fa-solid fa-check fa-lg" style="color: #00E096;"></i>';
    }
    updateProgress();
  }

  // Conectar los botones "Agregar habito" de los paneles laterales
  const asideButtons = document.querySelectorAll(".N-aside_input");
  asideButtons.forEach((btn) => {
    btn.style.cursor = "pointer";
    btn.addEventListener("click", () => {
      const section = btn.closest("section");
      if (!section) return;
      const habitInput = section.querySelector('input[placeholder="Habito"]');
      const descArea = section.querySelector("textarea");
      const name = habitInput ? habitInput.value : "";
      const desc = descArea ? descArea.value : "";

      addNewHabit(name, desc);
      if (habitInput) habitInput.value = "";
      if (descArea) descArea.value = "";
    });
  });

  // Conectar el botón rápido inferior `.N-week_input`
  const quickAddBtn = document.querySelector(".N-week_input");
  if (quickAddBtn) {
    quickAddBtn.style.cursor = "pointer";
    quickAddBtn.addEventListener("click", () => {
      const firstInput = document.querySelector('.N-aside_contenedor .carousel-item.active input[placeholder="Habito"]');
      if (firstInput && firstInput.value.trim()) {
        addNewHabit(firstInput.value.trim(), "");
        firstInput.value = "";
      } else if (firstInput) {
        firstInput.focus();
      }
    });
  }
});
