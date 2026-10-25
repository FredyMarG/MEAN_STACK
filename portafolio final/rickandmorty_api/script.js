/**
 * ============================================================================
 * CONTROLADOR RICK AND MORTY API (rickandmorty_api/script.js)
 * ============================================================================
 * Complemento: Este archivo se encontraba vacío (0 bytes). Se implementó el
 * consumo asíncrono (`async/await`) de la API oficial de Rick and Morty con
 * soporte de filtrado por nombre y tarjetas responsivas.
 */

const container = document.getElementById("charactersContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

/**
 * Obtiene personajes desde la API de Rick and Morty filtrados opcionalmente por nombre.
 * @param {string} nameFilter - Nombre o fragmento a buscar.
 */
async function loadCharacters(nameFilter = "") {
    try {
        container.innerHTML = `<div class="text-white py-5 fs-4">Cargando personajes del multiverso...</div>`;
        const endpoint = nameFilter
            ? `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(nameFilter)}`
            : `https://rickandmortyapi.com/api/character/?page=1`;

        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error("No se encontraron personajes con ese criterio.");
        }

        const data = await response.json();
        renderCharacters(data.results.slice(0, 12));
    } catch (error) {
        container.innerHTML = `
            <div class="alert alert-warning text-center w-50 my-4">
                ${error.message}
            </div>
        `;
    }
}

/**
 * Genera el HTML de cada tarjeta de personaje en el contenedor principal.
 * @param {Array<Object>} characters - Arreglo de personajes de la API.
 */
function renderCharacters(characters) {
    container.innerHTML = characters.map(char => {
        const badgeClass = char.status === "Alive" ? "bg-success" : char.status === "Dead" ? "bg-danger" : "bg-secondary";
        return `
        <div class="card bg-dark text-white border-secondary shadow" style="width: 22rem;">
            <img src="${char.image}" class="card-img-top" alt="${char.name}">
            <div class="card-body d-flex flex-column gap-1">
                <h5 class="card-title fw-bold mb-1">${char.name}</h5>
                <span><span class="badge ${badgeClass}">${char.status}</span> - ${char.species}</span>
                <span class="text-secondary small mt-2">Última ubicación conocida:</span>
                <span>${char.location.name}</span>
                <span class="text-secondary small mt-1">Origen: ${char.origin.name}</span>
            </div>
        </div>
        `;
    }).join("");
}

searchBtn.addEventListener("click", () => loadCharacters(searchInput.value.trim()));
searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") loadCharacters(searchInput.value.trim());
});

// Carga inicial
loadCharacters();
