/**
 * ============================================================================
 * CLIENTE FETCH API - RICK AND MORTY (fetch_api/script.js)
 * ============================================================================
 * Propósito: Consultar información de personajes específicos (IDs 1 y 183)
 * desde `https://rickandmortyapi.com/api/character/1,183` y construir tarjetas
 * Bootstrap en el contenedor `#printer`.
 *
 * Mejoras aplicadas:
 * 1. Se eliminó el bloque `if/else` redundante posterior al operador ternario
 *    para `statusColor`.
 * 2. Se añadió soporte para estado "unknown" (color `warning`) además de
 *    "Alive" (`success`) y "Dead" (`danger`).
 * 3. Se agregó manejo visual de errores en caso de fallo de red.
 */

/**
 * Renderiza un arreglo de personajes en el contenedor `#printer`.
 * @param {Array<Object>} array - Lista de objetos de personajes devueltos por la API.
 */
function printCards(array = []) {
    let printer = document.querySelector("#printer"),
        arrayOfCards = "";

    array.forEach(item => {
        // Operador ternario para asignar la clase semántica de Bootstrap según el estado vital
        let statusColor = item.status === "Alive"
            ? "success"
            : item.status === "Dead" ? "danger" : "warning";

        arrayOfCards += `
        <div class="card text-dark shadow" style="width: 22rem;">
            <img src="${item.image}" class="card-img-top" alt="${item.name}">
            <div class="card-body">
                <h5 class="card-title fw-bold">${item.name} - <span class="badge bg-${statusColor}">${item.status}</span></h5>
                <p class="mb-1"><strong>Especie:</strong> ${item.species}</p>
                <p class="mb-0 text-muted"><strong>Ubicación:</strong> ${item.location.name}</p>
            </div>
        </div>
        `;
    });

    printer.innerHTML = arrayOfCards;
}

/**
 * Consume el endpoint REST de Rick and Morty API usando `fetch` y promesas (`.then/.catch`).
 */
function getCharacters() {
    // 1. Definir la URL del endpoint con múltiples IDs separados por coma
    const url = "https://rickandmortyapi.com/api/character/1,183";

    // 2. Consumir la URL con fetch()
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            printCards(data);
            console.log("Personajes recibidos:", data);
        })
        .catch(error => {
            console.error("Error al consultar la API:", error);
            document.querySelector("#printer").innerHTML = `
                <div class="alert alert-danger">No se pudo conectar con la API de Rick & Morty: ${error.message}</div>
            `;
        });
}

// Inicialización
printCards();
getCharacters();
