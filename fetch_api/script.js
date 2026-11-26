/**
 * ============================================================================
 * CLIENTE FETCH API - RICK AND MORTY (fetch_api/script.js)
 * ============================================================================
 * Propósito educativo (Curso MEAN Stack):
 * Demostrar el consumo de una API REST usando Promesas (`.then() / .catch()`),
 * validando `response.ok`, midiendo latencia (`performance.now()`), soportando
 * tanto un único objeto como arreglos de personajes y protegiendo contra XSS.
 */

// Referencias a elementos de la interfaz
const printer = document.querySelector("#printer");
const idsForm = document.querySelector("#idsForm");
const idsInput = document.querySelector("#idsInput");
const btnRandom = document.querySelector("#btnRandom");
const endpointUrlEl = document.querySelector("#endpointUrl");
const latencyBadge = document.querySelector("#latencyBadge");
const jsonOutput = document.querySelector("#jsonOutput");

/**
 * Escapa caracteres HTML especiales para evitar XSS al renderizar datos externos.
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

/**
 * Dibuja en `#printer` las tarjetas de uno o varios personajes.
 * Nota: cuando se pide un solo ID (`/character/1`), la API devuelve un objeto;
 * cuando se piden varios (`/character/1,183`), devuelve un arreglo.
 * @param {object|object[]} data
 */
function printCards(data = []) {
  // Normaliza siempre a un arreglo para usar `.map()` sin errores
  const items = Array.isArray(data) ? data : [data];

  if (items.length === 0) {
    printer.innerHTML = `<div class="col-12 text-secondary py-4">No hay personajes para mostrar.</div>`;
    return;
  }

  printer.innerHTML = items.map((item) => {
    const statusColor = item.status === "Alive"
      ? "success"
      : item.status === "Dead" ? "danger" : "warning";

    return `
      <div class="col-md-6">
        <div class="fetch-card overflow-hidden h-100 d-flex flex-column">
          <img src="${escapeHtml(item.image)}" class="w-100" alt="${escapeHtml(item.name)}" style="height: 220px; object-fit: cover;">
          <div class="p-3 d-flex flex-column flex-grow-1">
            <h5 class="fw-bold text-white mb-1">${escapeHtml(item.name)}</h5>
            <div class="mb-2">
              <span class="badge bg-${statusColor}">${escapeHtml(item.status)}</span>
              <span class="small text-secondary ms-1">${escapeHtml(item.species)}</span>
            </div>
            <p class="small text-secondary mb-0 mt-auto">
              <strong>Ubicación:</strong> ${escapeHtml(item.location?.name || "Desconocida")}
            </p>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

/**
 * Consulta uno o varios IDs usando Promesas encadenadas (`.then()` / `.catch()`).
 * @param {string} ids - Lista de IDs numéricos separados por coma (ej. `"1,183"`).
 */
function getCharacters(ids = "1,183") {
  // Limpia espacios y conserva solo dígitos y comas para construir una URL válida
  const cleanIds = String(ids).replace(/[^0-9,]/g, "").replace(/^,+|,+$/g, "") || "1";
  const url = `https://rickandmortyapi.com/api/character/${cleanIds}`;
  const startTime = performance.now(); // Marca de tiempo inicial para medir latencia

  if (endpointUrlEl) endpointUrlEl.textContent = url;
  printer.innerHTML = `<div class="col-12 text-info py-4 fw-semibold">⏳ Resolviendo Promesa fetch()...</div>`;

  fetch(url)
    .then((response) => {
      // `fetch()` solo rechaza por fallo de red; los códigos HTTP 404/500 se validan con `response.ok`
      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      return response.json(); // Devuelve una nueva Promesa con el JSON parseado
    })
    .then((data) => {
      const elapsed = Math.round(performance.now() - startTime);
      if (latencyBadge) {
        latencyBadge.textContent = `200 OK • ${elapsed} ms`;
        latencyBadge.className = "badge bg-success px-3 py-2";
      }
      if (jsonOutput) jsonOutput.textContent = JSON.stringify(data, null, 2);
      printCards(data);
    })
    .catch((error) => {
      if (latencyBadge) {
        latencyBadge.textContent = "Error en Promesa";
        latencyBadge.className = "badge bg-danger px-3 py-2";
      }
      if (jsonOutput) jsonOutput.textContent = JSON.stringify({ error: error.message }, null, 2);
      printer.innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger">No se pudo completar la petición: ${escapeHtml(error.message)}</div>
        </div>
      `;
    });
}

// Consulta personalizada al enviar el formulario de IDs
if (idsForm) {
  idsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    getCharacters(idsInput.value);
  });
}

// Botón de personaje aleatorio (la API tiene 826 personajes)
if (btnRandom) {
  btnRandom.addEventListener("click", () => {
    const randomId = String(Math.floor(Math.random() * 826) + 1);
    idsInput.value = randomId;
    getCharacters(randomId);
  });
}

// Botones de selección rápida (ej. Familia Smith: IDs 1,2,3,4,5)
document.querySelectorAll(".preset-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    idsInput.value = btn.dataset.ids;
    getCharacters(btn.dataset.ids);
  });
});

// Consulta inicial por defecto al cargar la página
getCharacters("1,183");
