/**
 * ============================================================================
 * CONTROLADOR RICK AND MORTY API (rickandmorty_api/script.js)
 * ============================================================================
 * Propósito educativo (Curso MEAN Stack):
 * - Consumo asíncrono (`fetch` + `async/await`) de `rickandmortyapi.com`.
 * - Filtros combinados por nombre, estado y género usando `URLSearchParams`.
 * - Búsqueda en tiempo real con `debounce` para evitar peticiones excesivas.
 * - Persistencia de personajes favoritos en `localStorage`.
 * - Modal de detalle y prevención de XSS mediante `escapeHtml()`.
 */

// Clave en localStorage donde se guardan los personajes favoritos completos
const FAV_STORAGE_KEY = "rm_favorites_v1";

// Referencias a los elementos de la interfaz
const container = document.getElementById("charactersContainer");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const genderFilter = document.getElementById("genderFilter");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const btnFavFilter = document.getElementById("btnFavFilter");
const favCountEl = document.getElementById("favCount");
const totalBadge = document.getElementById("totalBadge");
const modalNameEl = document.getElementById("modalCharName");
const modalBodyEl = document.getElementById("modalCharBody");

// Estado global de paginación, filtros, favoritos y caché de la página actual
let currentPage = 1;
let totalPages = 1;
let totalCount = 0;
let showingFavoritesOnly = false;
let debounceTimer = null;
let currentCharacters = [];

/** Carga de forma segura los favoritos desde `localStorage`. */
function loadFavorites() {
  try {
    const parsed = JSON.parse(localStorage.getItem(FAV_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

let favorites = loadFavorites();

/** Persiste el arreglo de favoritos en `localStorage` y actualiza el contador visual. */
function saveFavorites() {
  localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(favorites));
  if (favCountEl) favCountEl.textContent = String(favorites.length);
}

/**
 * Escapa caracteres HTML peligrosos para prevenir ataques XSS al usar `innerHTML`.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[ch]));
}

/** Verifica si un personaje por su `id` está marcado como favorito. */
function isFavorite(id) {
  return favorites.some((f) => f.id === id);
}

/** Alterna el estado favorito de un personaje y vuelve a renderizar la vista actual. */
function toggleFavorite(id) {
  const target = currentCharacters.find((c) => c.id === id) || favorites.find((f) => f.id === id);
  if (!target) return;

  if (isFavorite(id)) {
    favorites = favorites.filter((f) => f.id !== id);
  } else {
    favorites = [target, ...favorites];
  }
  saveFavorites();

  if (showingFavoritesOnly) {
    renderFavoritesView();
  } else {
    renderCharacters(currentCharacters);
  }
}

/**
 * Consulta la API de Rick & Morty aplicando los filtros actuales de la barra superior.
 * @param {number} page - Número de página a consultar.
 */
async function loadCharacters(page = 1) {
  currentPage = page;
  showingFavoritesOnly = false;
  btnFavFilter.classList.remove("active", "btn-warning", "text-dark");
  btnFavFilter.classList.add("btn-outline-warning");

  try {
    // Muestra indicador de carga mientras responde la API
    container.innerHTML = `<div class="col-12 text-center text-info py-5 fs-5">🌀 Abriendo portal interdimensional...</div>`;

    const params = new URLSearchParams({ page: String(page) });
    const name = searchInput.value.trim();
    const status = statusFilter.value;
    const gender = genderFilter.value;

    if (name) params.set("name", name);
    if (status) params.set("status", status);
    if (gender) params.set("gender", gender);

    const response = await fetch(`https://rickandmortyapi.com/api/character/?${params.toString()}`);
    if (!response.ok) {
      throw new Error("No se encontraron personajes con esos filtros.");
    }

    const data = await response.json();
    totalPages = data.info?.pages || 1;
    totalCount = data.info?.count || 0;
    currentCharacters = data.results || [];
    totalBadge.textContent = `${totalCount} resultados`;

    renderCharacters(currentCharacters);
  } catch (error) {
    totalBadge.textContent = "0 resultados";
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning text-center my-4">${escapeHtml(error.message)}</div>
      </div>
    `;
  }
}

/** Renderiza únicamente los personajes guardados en favoritos (`localStorage`). */
function renderFavoritesView() {
  showingFavoritesOnly = true;
  btnFavFilter.classList.add("active", "btn-warning", "text-dark");
  btnFavFilter.classList.remove("btn-outline-warning");
  totalBadge.textContent = `${favorites.length} favoritos`;

  if (favorites.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center text-secondary py-5">
        Aún no tienes personajes favoritos. Haz clic en ☆ en cualquier tarjeta para guardarlo.
      </div>
    `;
    return;
  }
  renderCharacters(favorites, false);
}

/**
 * Construye el HTML de todas las tarjetas de personajes y la paginación opcional.
 * @param {object[]} characters
 * @param {boolean} showPagination
 */
function renderCharacters(characters, showPagination = true) {
  const cardsHtml = characters.map((char) => {
    const badgeClass = char.status === "Alive" ? "bg-success" : char.status === "Dead" ? "bg-danger" : "bg-secondary";
    const fav = isFavorite(char.id);

    return `
      <div class="col-sm-6 col-lg-4 col-xl-3">
        <article class="rm-card h-100 d-flex flex-column">
          <div class="position-relative">
            <img src="${escapeHtml(char.image)}" class="w-100" alt="${escapeHtml(char.name)}" style="height: 240px; object-fit: cover;">
            <button type="button" class="btn btn-sm position-absolute top-0 end-0 m-2 fav-btn ${fav ? "btn-warning text-dark" : "btn-dark bg-opacity-75 text-white"}"
              data-id="${Number(char.id)}" title="Guardar en favoritos">
              ${fav ? "★" : "☆"}
            </button>
          </div>
          <div class="p-3 d-flex flex-column flex-grow-1">
            <h5 class="fw-bold text-white mb-1">${escapeHtml(char.name)}</h5>
            <div class="small mb-2">
              <span class="badge ${badgeClass}">${escapeHtml(char.status)}</span>
              <span class="text-secondary ms-1">${escapeHtml(char.species)}</span>
            </div>
            <div class="small text-secondary mb-3 flex-grow-1">
              <div><strong>Origen:</strong> ${escapeHtml(char.origin?.name || "Desconocido")}</div>
              <div><strong>Ubicación:</strong> ${escapeHtml(char.location?.name || "Desconocida")}</div>
            </div>
            <button type="button" class="btn btn-outline-info btn-sm w-100 detail-btn" data-id="${Number(char.id)}">
              Ver detalle (${Array.isArray(char.episode) ? char.episode.length : 0} episodios)
            </button>
          </div>
        </article>
      </div>
    `;
  }).join("");

  const paginationHtml = showPagination
    ? `
      <div class="col-12 d-flex justify-content-center align-items-center gap-3 my-3">
        <button class="btn btn-outline-light btn-sm" id="prevPageBtn" ${currentPage <= 1 ? "disabled" : ""}>← Anterior</button>
        <span class="text-light small">Página ${currentPage} de ${totalPages}</span>
        <button class="btn btn-outline-light btn-sm" id="nextPageBtn" ${currentPage >= totalPages ? "disabled" : ""}>Siguiente →</button>
      </div>
    `
    : "";

  container.innerHTML = cardsHtml + paginationHtml;

  // Conecta botones de paginación cuando corresponda
  if (showPagination) {
    const prevBtn = document.getElementById("prevPageBtn");
    const nextBtn = document.getElementById("nextPageBtn");
    if (prevBtn) prevBtn.addEventListener("click", () => loadCharacters(currentPage - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => loadCharacters(currentPage + 1));
  }
}

/** Abre el modal de Bootstrap con la ficha completa del personaje seleccionado. */
function openDetailModal(id) {
  const char = currentCharacters.find((c) => c.id === id) || favorites.find((f) => f.id === id);
  if (!char || !window.bootstrap) return;

  modalNameEl.textContent = char.name;
  modalBodyEl.innerHTML = `
    <div class="text-center mb-3">
      <img src="${escapeHtml(char.image)}" alt="${escapeHtml(char.name)}" class="rounded-4 border border-secondary" style="width: 180px; height: 180px; object-fit: cover;">
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item bg-dark text-white border-secondary d-flex justify-content-between"><span>Estado</span><strong>${escapeHtml(char.status)}</strong></li>
      <li class="list-group-item bg-dark text-white border-secondary d-flex justify-content-between"><span>Especie</span><strong>${escapeHtml(char.species)}</strong></li>
      <li class="list-group-item bg-dark text-white border-secondary d-flex justify-content-between"><span>Género</span><strong>${escapeHtml(char.gender)}</strong></li>
      <li class="list-group-item bg-dark text-white border-secondary d-flex justify-content-between"><span>Origen</span><strong>${escapeHtml(char.origin?.name)}</strong></li>
      <li class="list-group-item bg-dark text-white border-secondary d-flex justify-content-between"><span>Ubicación</span><strong>${escapeHtml(char.location?.name)}</strong></li>
      <li class="list-group-item bg-dark text-white border-secondary d-flex justify-content-between"><span>Episodios</span><strong>${Array.isArray(char.episode) ? char.episode.length : 0}</strong></li>
    </ul>
  `;

  window.bootstrap.Modal.getOrCreateInstance(document.getElementById("charDetailModal")).show();
}

// Delegación de eventos para botones de favorito (☆/★) y modal de detalle
container.addEventListener("click", (e) => {
  const favBtn = e.target.closest(".fav-btn");
  if (favBtn) {
    toggleFavorite(Number(favBtn.dataset.id));
    return;
  }
  const detailBtn = e.target.closest(".detail-btn");
  if (detailBtn) {
    openDetailModal(Number(detailBtn.dataset.id));
  }
});

// Eventos de búsqueda, filtros y limpieza
searchBtn.addEventListener("click", () => loadCharacters(1));
statusFilter.addEventListener("change", () => loadCharacters(1));
genderFilter.addEventListener("change", () => loadCharacters(1));

searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => loadCharacters(1), 350);
});

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  statusFilter.value = "";
  genderFilter.value = "";
  loadCharacters(1);
});

btnFavFilter.addEventListener("click", () => {
  if (showingFavoritesOnly) loadCharacters(1);
  else renderFavoritesView();
});

// Inicializa contador de favoritos y carga la primera página
saveFavorites();
loadCharacters(1);
