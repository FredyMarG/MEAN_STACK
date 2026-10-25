/**
 * ============================================================================
 * RETO HACKATHON: PARSER DE QUERY PARAMS EN URL (hackathon/script.js)
 * ============================================================================
 * Propósito: Extraer los valores de los parámetros pasados por QueryString en
 * una URL (`?nombre=Miguel&edad=125`) almacenándolos en un arreglo `["Miguel", "125"]`.
 *
 * Explicación del algoritmo original:
 * 1. `link.search("=") + 1` localiza el primer signo `=` y avanza una posición.
 * 2. `link.search("&")` localiza el separador `&` donde termina el primer valor.
 * 3. `link.slice(igual, amper)` recorta el primer valor ("Miguel").
 * 4. `link.search("d=") + 2` localiza el final de `edad=` y recorta hasta `link.length`.
 */

function url(customLink) {
    let link = customLink || "https://urldelapagina.com?nombre=Miguel&edad=125";
    let array = [];

    // Índices para el primer parámetro (nombre)
    let igual = link.search("=") + 1;
    let amper = link.search("&");

    // Índices para el segundo parámetro (edad)
    let igual2 = link.search("d=") + 2;
    let amper2 = link.length;

    // Extracción de subcadenas con slice()
    let result = link.slice(igual, amper);
    let result2 = link.slice(igual2, amper2);

    array = [result, result2];
    console.log("Parámetros extraídos (algoritmo slice):", array);
    return array;
}

/**
 * Función complementaria para conectar con la interfaz HTML interactiva.
 */
function procesarUrl() {
    const inputEl = document.getElementById("urlInput");
    const outputEl = document.getElementById("output");
    if (!inputEl || !outputEl) return;

    const resultado = url(inputEl.value);
    outputEl.textContent = JSON.stringify(
        {
            metodo_slice: resultado,
            nombre: resultado[0],
            edad: resultado[1]
        },
        null,
        2
    );
}

// Ejecución inicial
url();
procesarUrl();
