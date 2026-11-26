/**
 * ============================================================================
 * LÓGICA DE VALIDACIÓN Y ALMACENAMIENTO DEL FORMULARIO (Formulario/script.js)
 * ============================================================================
 * Propósito educativo (Curso MEAN Stack):
 * - Validar campos obligatorios (incluyendo regex de correo y salario >= 0).
 * - Cambiar el estilo del botón según género (`.btn-primary` / `.btn-pink`).
 * - Mostrar dinámicamente `#otro` cuando se selecciona el cargo `"otros"`.
 * - Persistir aspirantes en `localStorage`, filtrar en vivo, eliminar registros
 *   individuales, limpiar toda la lista y exportar el arreglo a `.json`.
 */

const STORAGE_KEY = "formulario_aspirantes_v1";

// Referencias a campos del formulario
const form = document.querySelector("#registroForm");
const nombre = document.querySelector("#nombre");
const apellido = document.querySelector("#apellido");
const aspiracion = document.querySelector("#aspiracion");
const correo = document.querySelector("#correo");
const hombre = document.querySelector("#hombre");
const mujer = document.querySelector("#mujer");
const cargo = document.querySelector("#cargo");
const otro = document.querySelector("#otro");
const btn_submit = document.querySelector("#submit");

// Referencias a alertas, lista, buscador e inspector JSON
const alertDOMCorrect = document.querySelector("#alertCorrect");
const alertDOMIncorrect = document.querySelector("#alertIncorrect");
const listaRegistros = document.querySelector("#listaRegistros");
const searchInput = document.querySelector("#searchInput");
const jsonViewer = document.querySelector("#jsonViewer");
const totalBadge = document.querySelector("#totalBadge");

/** Carga de forma segura los aspirantes guardados en `localStorage`. */
function cargarAspirantes() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

let listaAspirantes = cargarAspirantes();

/** Guarda el arreglo actual en `localStorage` y actualiza el contador y visor JSON. */
function persistirYActualizarVista() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listaAspirantes));
  if (totalBadge) totalBadge.textContent = `${listaAspirantes.length} registrados`;
  if (jsonViewer) jsonViewer.textContent = JSON.stringify(listaAspirantes, null, 2);
  renderAspirantes();
}

/**
 * Renderiza la lista filtrada usando nodos DOM (`createElement` + `textContent`)
 * para evitar cualquier vulnerabilidad XSS.
 */
function renderAspirantes() {
  if (!listaRegistros) return;
  const q = (searchInput?.value || "").trim().toLowerCase();
  const filtrados = listaAspirantes
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) =>
      !q ||
      `${item.nombre} ${item.apellido}`.toLowerCase().includes(q) ||
      String(item.cargo || "").toLowerCase().includes(q)
    );

  listaRegistros.innerHTML = "";

  if (filtrados.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.className = "list-group-item bg-transparent text-secondary text-center py-4 border-secondary";
    emptyLi.textContent = "No hay aspirantes registrados con ese criterio.";
    listaRegistros.appendChild(emptyLi);
    return;
  }

  const frag = document.createDocumentFragment();
  filtrados.forEach(({ item, idx }) => {
    const li = document.createElement("li");
    li.className = "list-group-item bg-dark text-white border-secondary d-flex justify-content-between align-items-center gap-2";

    const left = document.createElement("div");
    const strong = document.createElement("strong");
    strong.textContent = `${item.nombre} ${item.apellido}`;
    left.appendChild(strong);
    left.appendChild(document.createTextNode(` (${item.genero}) — `));

    const badge = document.createElement("span");
    badge.className = "badge bg-info text-dark";
    badge.textContent = item.cargo;
    left.appendChild(badge);

    const emailDiv = document.createElement("div");
    emailDiv.className = "small text-secondary";
    emailDiv.textContent = item.email;
    left.appendChild(emailDiv);

    const right = document.createElement("div");
    right.className = "d-flex align-items-center gap-2";

    const salary = document.createElement("span");
    salary.className = "fw-bold text-success small";
    salary.textContent = `$${Number(item.aspiracion).toLocaleString("es-CO")}`;

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "btn btn-sm btn-outline-danger del-asp-btn";
    delBtn.dataset.idx = String(idx);
    delBtn.textContent = "×";

    right.appendChild(salary);
    right.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(right);
    frag.appendChild(li);
  });

  listaRegistros.appendChild(frag);
}

/** Aplica botón azul (`.btn-primary`) cuando se elige género masculino. */
function blue() {
  if (hombre.checked) {
    btn_submit.classList.remove("d-none", "btn-pink", "btn-danger");
    btn_submit.classList.add("btn-primary", "btn");
  }
}

/** Aplica botón rosado (`.btn-pink`) cuando se elige género femenino. */
function pink() {
  if (mujer.checked) {
    btn_submit.classList.remove("d-none", "btn-primary");
    btn_submit.classList.add("btn-pink", "btn");
  }
}

// Muestra u oculta el campo adicional cuando el cargo seleccionado es "otros"
cargo.addEventListener("change", () => {
  if (cargo.value === "otros") {
    otro.classList.remove("d-none");
  } else {
    otro.classList.add("d-none");
    otro.value = "";
  }
});

// Valida todos los campos al enviar y guarda el registro JSON en localStorage
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const cargoSeleccionado = cargo.value === "otros" ? otro.value.trim() : cargo.value;
  const aspiracionNum = Number(aspiracion.value);
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim());

  if (
    nombre.value.trim() !== "" &&
    apellido.value.trim() !== "" &&
    aspiracion.value.trim() !== "" &&
    Number.isFinite(aspiracionNum) &&
    aspiracionNum >= 0 &&
    emailValido &&
    (hombre.checked || mujer.checked) &&
    cargoSeleccionado !== ""
  ) {
    listaAspirantes.push({
      nombre: nombre.value.trim(),
      apellido: apellido.value.trim(),
      aspiracion: aspiracionNum,
      email: correo.value.trim(),
      genero: hombre.checked ? "Masculino" : "Femenino",
      cargo: cargoSeleccionado
    });

    persistirYActualizarVista();
    alertDOMCorrect.classList.remove("d-none");
    alertDOMIncorrect.classList.add("d-none");

    form.reset();
    otro.classList.add("d-none");
  } else {
    alertDOMCorrect.classList.add("d-none");
    alertDOMIncorrect.classList.remove("d-none");
  }
});

// Delegación de eventos para eliminar un aspirante individual
listaRegistros?.addEventListener("click", (e) => {
  const btn = e.target.closest(".del-asp-btn");
  if (!btn) return;
  const idx = Number(btn.dataset.idx);
  listaAspirantes = listaAspirantes.filter((_, i) => i !== idx);
  persistirYActualizarVista();
});

// Filtro en vivo al escribir en el buscador
searchInput?.addEventListener("input", renderAspirantes);

// Botón para limpiar toda la lista almacenada
document.querySelector("#btnClearAll")?.addEventListener("click", () => {
  listaAspirantes = [];
  persistirYActualizarVista();
});

// Exporta la lista actual como descarga de archivo `aspirantes.json`
document.querySelector("#btnExportJson")?.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(listaAspirantes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "aspirantes.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Carga inicial al abrir la página
persistirYActualizarVista();
