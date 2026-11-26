/**
 * ============================================================================
 * GESTOR DE ROADMAP DE TAREAS CON POO (proyectoBit/js/roadMapTareas.js)
 * ============================================================================
 * Propósito: Controlar todas las funciones del tablero Roadmap:
 * - Vista de Tabla vs Vista de Tarjetas (`Vista de Tabla`).
 * - Creación de nuevas tareas (`+` y `New Task`) con modal y `localStorage`.
 * - Eliminación de tareas (`Remove Task` con modo borrado por fila).
 * - Filtrado por estado (`Filter`), búsqueda en vivo (`Search`) y ordenamiento
 *   ascendente/descendente (`Sort` + `Deshacer Sort`).
 * - Edición del título de la tabla (`Edit`) y cambio de estado por fila.
 */

class taskData {
    constructor(name, state, typeOfTask, startDate, endDate, inChargeOf) {
        this.name = name;
        this.state = state;
        this.typeOfTask = typeOfTask;
        this.startDate = startDate;
        this.endDate = endDate;
        this.inChargeOf = inChargeOf;
    }

    getProperties() {
        return [this.name, this.state, this.typeOfTask, this.startDate, this.endDate, this.inChargeOf];
    }
}

const ROADMAP_DATA_KEY = "proyectoBit_roadmap_data_v2";
const ROADMAP_TITLE_KEY = "proyectoBit_roadmap_title_v2";
const MESES_ES = {
    ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
    jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11
};
const ESTADOS_CLASE = {
    "Completado": "btn-success",
    "En Progreso": "btn-primary",
    "Con Demora": "btn-warning",
    "Aplazado": "btn-light",
    "Cancelado": "btn-danger",
    "No Iniciado": "btn-secondary"
};

let myTasks = [];
let myTasksorig = [];
let removeMode = false;
let activeRowIndex = null;
let statusFilter = "";
let searchFilter = "";
let isCardsView = false;

const tbodyEl = document.querySelector("table tbody");
const tableWrapper = document.querySelector(".table-responsive");
const cardsContainer = document.getElementById("cardsViewContainer");

function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (ch) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
}

function stripTags(html) {
    return String(html ?? "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function parseRoadmapDate(str) {
    const clean = stripTags(str);
    if (!clean || clean.toUpperCase() === "N/A") return Number.MAX_SAFE_INTEGER;
    const match = clean.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
    if (!match) return Date.parse(clean) || 0;
    const [, d, mStr, y] = match;
    const month = MESES_ES[mStr.toLowerCase()] ?? 0;
    return new Date(Number(y), month, Number(d)).getTime();
}

function buildStateButton(estadoTexto) {
    const clean = stripTags(estadoTexto) || "No Iniciado";
    const cls = ESTADOS_CLASE[clean] || "btn-secondary";
    return `<button type="button" class="btn ${cls} state-trigger" data-bs-toggle="modal" data-bs-target="#exampleModal">${escapeHtml(clean)}</button>`;
}

function readInitialRowsFromDOM() {
    if (!tbodyEl) return [];
    return Array.from(tbodyEl.querySelectorAll("tr")).map((tr) => {
        const tds = tr.querySelectorAll("td");
        return new taskData(
            stripTags(tds[0]?.textContent),
            stripTags(tds[1]?.textContent),
            stripTags(tds[2]?.textContent),
            stripTags(tds[3]?.textContent),
            stripTags(tds[4]?.textContent),
            stripTags(tds[5]?.textContent)
        );
    });
}

function saveTasks() {
    try {
        localStorage.setItem(ROADMAP_DATA_KEY, JSON.stringify(myTasks));
    } catch {}
}

function loadTasks() {
    try {
        const saved = JSON.parse(localStorage.getItem(ROADMAP_DATA_KEY) || "null");
        if (Array.isArray(saved) && saved.length > 0) {
            return saved.map((t) => new taskData(t.name, t.state, t.typeOfTask, t.startDate, t.endDate, t.inChargeOf));
        }
    } catch {}
    return readInitialRowsFromDOM();
}

function getFilteredTasks() {
    return myTasks.filter((t) => {
        const matchStatus = !statusFilter || t.state === statusFilter;
        const q = searchFilter.toLowerCase();
        const matchSearch = !q ||
            t.name.toLowerCase().includes(q) ||
            t.typeOfTask.toLowerCase().includes(q) ||
            t.inChargeOf.toLowerCase().includes(q) ||
            t.state.toLowerCase().includes(q);
        return matchStatus && matchSearch;
    });
}

function renderAll() {
    const visible = getFilteredTasks();

    if (tbodyEl) {
        tbodyEl.innerHTML = visible.map((t, idx) => {
            const realIndex = myTasks.indexOf(t);
            const delBtn = removeMode
                ? `<button type="button" class="btn btn-sm btn-outline-danger ms-2 delete-row-btn" data-index="${realIndex}" title="Eliminar tarea">×</button>`
                : "";
            return `
              <tr class="text-light dg-no-border-table" data-index="${realIndex}">
                <th scope="row">${idx + 1}${delBtn}</th>
                <td>${escapeHtml(t.name)}</td>
                <td>${buildStateButton(t.state)}</td>
                <td>${escapeHtml(t.typeOfTask)}</td>
                <td>${escapeHtml(t.startDate)}</td>
                <td>${escapeHtml(t.endDate)}</td>
                <td style="border-bottom: none;">${escapeHtml(t.inChargeOf)}</td>
              </tr>
            `;
        }).join("");
    }

    if (cardsContainer) {
        cardsContainer.innerHTML = visible.map((t) => {
            const realIndex = myTasks.indexOf(t);
            const cls = ESTADOS_CLASE[t.state] || "btn-secondary";
            return `
              <div class="col-md-4" data-index="${realIndex}">
                <div class="card bg-dark text-light border-secondary p-3 h-100">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge bg-info text-dark">${escapeHtml(t.typeOfTask)}</span>
                    <button type="button" class="btn btn-sm ${cls} state-trigger" data-bs-toggle="modal" data-bs-target="#exampleModal">${escapeHtml(t.state)}</button>
                  </div>
                  <h5 class="fw-bold">${escapeHtml(t.name)}</h5>
                  <div class="small text-secondary mt-auto">
                    <div>Inicio: ${escapeHtml(t.startDate)} | Entrega: ${escapeHtml(t.endDate)}</div>
                    <div>Encargado: <strong class="text-light">${escapeHtml(t.inChargeOf)}</strong></div>
                  </div>
                </div>
              </div>
            `;
        }).join("");
    }
}

// Inicialización
myTasks = loadTasks();
myTasksorig = myTasks.map((t) => new taskData(t.name, t.state, t.typeOfTask, t.startDate, t.endDate, t.inChargeOf));

const titleEl = document.getElementById("tableTitle");
const savedTitle = localStorage.getItem(ROADMAP_TITLE_KEY);
if (titleEl && savedTitle) titleEl.textContent = savedTitle;

renderAll();

// Cambio de estado mediante delegación de eventos (funciona en tabla y tarjetas)
document.addEventListener("click", (e) => {
    const trigger = e.target.closest(".state-trigger");
    if (trigger) {
        const holder = trigger.closest("[data-index]");
        if (holder) activeRowIndex = Number(holder.dataset.index);
        return;
    }

    const delBtn = e.target.closest(".delete-row-btn");
    if (delBtn) {
        const idx = Number(delBtn.dataset.index);
        myTasks.splice(idx, 1);
        saveTasks();
        renderAll();
    }
});

// Botones del modal de estado (#opt1..#opt6)
const modalOptMap = {
    opt1: "Completado",
    opt2: "En Progreso",
    opt3: "Con Demora",
    opt4: "Aplazado",
    opt5: "Cancelado",
    opt6: "No Iniciado"
};
Object.entries(modalOptMap).forEach(([optId, stateName]) => {
    const btn = document.getElementById(optId);
    if (btn) {
        btn.addEventListener("click", () => {
            if (activeRowIndex !== null && myTasks[activeRowIndex]) {
                myTasks[activeRowIndex].state = stateName;
                saveTasks();
                renderAll();
            }
        });
    }
});

// Ordenamiento (Sort)
function crearSort(elementid, asc, property, indicador) {
    const btn = document.getElementById(elementid);
    if (!btn) return;
    btn.addEventListener("click", () => {
        const isDateCol = property === "startDate" || property === "endDate";
        myTasks.sort((a, b) => {
            const valA = isDateCol ? parseRoadmapDate(a[property]) : String(a[property]).toLowerCase();
            const valB = isDateCol ? parseRoadmapDate(b[property]) : String(b[property]).toLowerCase();
            if (valA === valB) return 0;
            return asc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
        });
        saveTasks();
        renderAll();
        const indEl = document.getElementById("indicadorFiltro");
        if (indEl) indEl.innerHTML = `<button class="btn btn-primary ms-5">${indicador}</button>`;
    });
}

crearSort("tareades", false, "name", "Tarea Desc");
crearSort("tareaasc", true, "name", "Tarea Asc");
crearSort("estadodes", false, "state", "Estado Desc");
crearSort("estadoasc", true, "state", "Estado Asc");
crearSort("tipodes", false, "typeOfTask", "Tipo Desc");
crearSort("tipoasc", true, "typeOfTask", "Tipo Asc");
crearSort("fechaindes", false, "startDate", "Fecha de Inicio Desc");
crearSort("fechainasc", true, "startDate", "Fecha de Inicio Asc");
crearSort("fechafides", false, "endDate", "Fecha de Entrega Desc");
crearSort("fechafiasc", true, "endDate", "Fecha de Entrega Asc");
crearSort("encardes", false, "inChargeOf", "Encargado Desc");
crearSort("encarasc", true, "inChargeOf", "Encargado Asc");

document.getElementById("deshacer")?.addEventListener("click", () => {
    myTasks = myTasksorig.map((t) => new taskData(t.name, t.state, t.typeOfTask, t.startDate, t.endDate, t.inChargeOf));
    saveTasks();
    renderAll();
    const indEl = document.getElementById("indicadorFiltro");
    if (indEl) indEl.innerHTML = '<button class="btn btn-dark ms-5">Sin Filtro</button>';
});

// Botón Vista de Tabla / Tarjetas
document.getElementById("btnToggleView")?.addEventListener("click", (e) => {
    isCardsView = !isCardsView;
    if (tableWrapper) tableWrapper.classList.toggle("d-none", isCardsView);
    if (cardsContainer) cardsContainer.classList.toggle("d-none", !isCardsView);
    e.currentTarget.textContent = isCardsView ? "Vista de Tarjetas" : "Vista de Tabla";
});

// Botón Filter
document.getElementById("btnFilter")?.addEventListener("click", () => {
    document.getElementById("filterBar")?.classList.toggle("d-none");
    document.getElementById("filterBar")?.classList.add("d-flex");
});
document.getElementById("statusFilterSelect")?.addEventListener("change", (e) => {
    statusFilter = e.target.value;
    renderAll();
});

// Botón Search
document.getElementById("btnSearch")?.addEventListener("click", () => {
    const sb = document.getElementById("searchBar");
    if (!sb) return;
    sb.classList.toggle("d-none");
    if (!sb.classList.contains("d-none")) {
        document.getElementById("roadmapSearchInput")?.focus();
    }
});
document.getElementById("roadmapSearchInput")?.addEventListener("input", (e) => {
    searchFilter = e.target.value.trim();
    renderAll();
});

// Botón Remove Task (activa/desactiva botones × en cada fila)
document.getElementById("btnRemoveTask")?.addEventListener("click", (e) => {
    removeMode = !removeMode;
    e.currentTarget.classList.toggle("btn-danger", removeMode);
    e.currentTarget.classList.toggle("btn-dark", !removeMode);
    renderAll();
});

// Botón Edit (renombrar título de la tabla)
document.getElementById("btnEditTitle")?.addEventListener("click", () => {
    if (!titleEl) return;
    const nuevo = window.prompt("Nuevo nombre para la tabla:", titleEl.textContent.trim());
    if (nuevo && nuevo.trim()) {
        titleEl.textContent = nuevo.trim();
        localStorage.setItem(ROADMAP_TITLE_KEY, titleEl.textContent);
    }
});

// Formulario New Task (+ / New Task)
document.getElementById("newTaskForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("ntName").value.trim();
    const state = document.getElementById("ntState").value;
    const typeOfTask = document.getElementById("ntType").value.trim();
    const startDate = document.getElementById("ntStart").value.trim() || "N/A";
    const endDate = document.getElementById("ntEnd").value.trim() || "N/A";
    const inChargeOf = document.getElementById("ntOwner").value.trim();
    if (!name || !typeOfTask || !inChargeOf) return;

    const item = new taskData(name, state, typeOfTask, startDate, endDate, inChargeOf);
    myTasks.push(item);
    myTasksorig.push(new taskData(name, state, typeOfTask, startDate, endDate, inChargeOf));
    saveTasks();
    renderAll();
    e.target.reset();

    const modalEl = document.getElementById("newTaskModal");
    const inst = window.bootstrap?.Modal.getInstance(modalEl);
    if (inst) inst.hide();
});
