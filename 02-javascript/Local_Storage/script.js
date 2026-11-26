/**
 * ============================================================================
 * MANEJO DE LOCALSTORAGE Y SERIALIZACIÓN JSON (Local_Storage/script.js)
 * ============================================================================
 * Propósito educativo (Curso MEAN Stack):
 * - Demostrar `localStorage.getItem()` / `setItem()` junto con `JSON.stringify`
 *   y `JSON.parse` protegidos con `try/catch`.
 * - Permitir agregar elementos, eliminar uno por índice, restaurar la semilla
 *   inicial `[1, 2, 3, 4, 5]`, limpiar todo y medir el peso en bytes.
 */

const STORAGE_KEY = "llave";
const DEFAULT_SEED = [1, 2, 3, 4, 5];

// Inicializa con datos semilla si aún no existe en el navegador
if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED));
}

/** Lee y parsea de forma segura el arreglo guardado en `localStorage`. */
function obtenerElementos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Agrega un nuevo elemento desde `#itemInput` y refresca la vista. */
function guardarElemento() {
  const input = document.getElementById("itemInput");
  if (!input || input.value.trim() === "") return;

  const lista = obtenerElementos();
  lista.push(input.value.trim());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  input.value = "";
  renderizarVista();
}

/** Elimina un único elemento según su índice en el arreglo. */
function eliminarElemento(index) {
  const lista = obtenerElementos().filter((_, idx) => idx !== index);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  renderizarVista();
}

/** Restaura el arreglo semilla inicial `[1, 2, 3, 4, 5]`. */
function restaurarSemilla() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED));
  renderizarVista();
}

/** Vacía la colección almacenada en `localStorage` dejando `[]`. */
function limpiarStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  renderizarVista();
}

/** Actualiza las píldoras interactivas, el visor JSON y el indicador de bytes. */
function renderizarVista() {
  const datos = obtenerElementos();
  const rawJson = JSON.stringify(datos, null, 2);
  const bytes = new Blob([localStorage.getItem(STORAGE_KEY) || ""]).size;

  const viewer = document.getElementById("storageViewer");
  const metricsBadge = document.getElementById("metricsBadge");
  const pillsBox = document.getElementById("itemsPills");

  if (viewer) viewer.textContent = rawJson;
  if (metricsBadge) metricsBadge.textContent = `${datos.length} ítems • ${bytes} B`;

  if (pillsBox) {
    pillsBox.innerHTML = "";
    if (datos.length === 0) {
      const empty = document.createElement("span");
      empty.className = "small text-secondary";
      empty.textContent = "Sin elementos guardados.";
      pillsBox.appendChild(empty);
      return;
    }

    const frag = document.createDocumentFragment();
    datos.forEach((val, idx) => {
      const badge = document.createElement("span");
      badge.className = "badge bg-dark border border-secondary d-inline-flex align-items-center gap-2 px-2 py-1";

      const label = document.createElement("span");
      label.textContent = String(val);

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "btn btn-sm p-0 text-danger fw-bold border-0 bg-transparent";
      delBtn.textContent = "×";
      delBtn.title = "Eliminar elemento";
      delBtn.addEventListener("click", () => eliminarElemento(idx));

      badge.appendChild(label);
      badge.appendChild(delBtn);
      frag.appendChild(badge);
    });
    pillsBox.appendChild(frag);
  }
}

// Permite guardar con Enter y renderiza el estado inicial al cargar
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("itemInput");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        guardarElemento();
      }
    });
  }
  renderizarVista();
});
