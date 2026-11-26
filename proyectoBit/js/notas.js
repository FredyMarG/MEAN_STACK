/**
 * ============================================================================
 * GESTOR DE NOTAS RÁPIDAS (proyectoBit/js/notas.js)
 * ============================================================================
 * Propósito: Permitir crear, buscar, fijar/desfijar y eliminar notas rápidas
 * con etiquetas de color y persistencia automática en `localStorage`
 * (`proyectoBit_notas_v1`).
 */

document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "proyectoBit_notas_v1";
  const form = document.getElementById("notaForm");
  const titleInput = document.getElementById("notaTitulo");
  const bodyInput = document.getElementById("notaContenido");
  const colorSelect = document.getElementById("notaColor");
  const searchInput = document.getElementById("notaBuscar");
  const grid = document.getElementById("notasGrid");
  const countBadge = document.getElementById("notasCountBadge");

  if (!form || !grid) return;

  /** Escapa caracteres especiales para prevenir XSS al renderizar notas. */
  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }

  /** Carga las notas guardadas en `localStorage` o inicializa una nota de ejemplo. */
  function loadNotes() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return [
      {
        id: 1,
        title: "Ideas Sprint MEAN Stack",
        body: "Revisar endpoints de Turismo_MEAN y completar sesión Pomodoro.",
        color: "border-info",
        pinned: true,
        createdAt: new Date().toLocaleDateString("es-CO")
      }
    ];
  }

  let notes = loadNotes();
  let query = "";

  /** Persiste el arreglo de notas en `localStorage`. */
  function saveNotes() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {}
  }

  /** Filtra por búsqueda, prioriza notas fijadas (`pinned`) y renderiza la grilla. */
  function renderNotes() {
    const q = query.toLowerCase();
    const filtered = notes
      .filter((n) => !q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q))
      .sort((a, b) => Number(b.pinned) - Number(a.pinned));

    if (countBadge) {
      countBadge.textContent = `${filtered.length} ${filtered.length === 1 ? "nota" : "notas"}`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="col-12 text-center text-secondary py-5">No hay notas para mostrar.</div>`;
      return;
    }

    grid.innerHTML = filtered
      .map((n) => `
        <div class="col-md-6 col-lg-4">
          <div class="p-3 rounded-3 bg-dark border ${escapeHtml(n.color || "border-secondary")} h-100 d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
              <h5 class="fw-bold text-white mb-0">${escapeHtml(n.title)}</h5>
              <div class="d-flex gap-1">
                <button type="button" class="btn btn-sm ${n.pinned ? "btn-warning" : "btn-outline-secondary"} pin-note-btn" data-id="${n.id}" title="Fijar nota">📌</button>
                <button type="button" class="btn btn-sm btn-outline-danger del-note-btn" data-id="${n.id}" title="Eliminar nota">×</button>
              </div>
            </div>
            <p class="text-secondary small flex-grow-1 mb-2" style="white-space: pre-wrap;">${escapeHtml(n.body)}</p>
            <small class="text-muted">${escapeHtml(n.createdAt || "")}</small>
          </div>
        </div>
      `)
      .join("");
  }

  // Alta de nueva nota
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();
    if (!title || !body) return;

    notes.unshift({
      id: Date.now(),
      title,
      body,
      color: colorSelect.value || "border-info",
      pinned: false,
      createdAt: new Date().toLocaleDateString("es-CO")
    });
    saveNotes();
    renderNotes();
    form.reset();
  });

  // Delegación de eventos para fijar o eliminar notas
  grid.addEventListener("click", (e) => {
    const delBtn = e.target.closest(".del-note-btn");
    if (delBtn) {
      const id = Number(delBtn.dataset.id);
      notes = notes.filter((n) => n.id !== id);
      saveNotes();
      renderNotes();
      return;
    }

    const pinBtn = e.target.closest(".pin-note-btn");
    if (pinBtn) {
      const id = Number(pinBtn.dataset.id);
      notes = notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n));
      saveNotes();
      renderNotes();
    }
  });

  // Filtrado en tiempo real
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      query = e.target.value.trim();
      renderNotes();
    });
  }

  renderNotes();
});
