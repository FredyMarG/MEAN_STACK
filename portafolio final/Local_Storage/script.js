/**
 * ============================================================================
 * MANEJO DE LOCALSTORAGE Y SERIALIZACIÓN JSON (Local_Storage/script.js)
 * ============================================================================
 * Propósito: Demostrar cómo almacenar estructuras de datos (arreglos/objetos)
 * en `localStorage` convirtiéndolas a cadena JSON con `JSON.stringify()` y
 * reconstruyéndolas con `JSON.parse()`.
 *
 * Corrección aplicada:
 * En el archivo original se invocaba `JSON.parse(JSON)` pasando el objeto global
 * `JSON` en lugar de la cadena recuperada de `localStorage.getItem("llave")`,
 * lo que generaba un `SyntaxError`.
 */

const STORAGE_KEY = "llave";

// Inicializar con el arreglo base [1, 2, 3, 4, 5] si no existe aún en localStorage
if (!localStorage.getItem(STORAGE_KEY)) {
    const arregloInicial = [1, 2, 3, 4, 5];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arregloInicial));
}

/**
 * Lee y deserializa el arreglo almacenado en `localStorage`.
 * @returns {Array}
 */
function obtenerElementos() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

/**
 * Agrega un nuevo elemento al arreglo persistido en `localStorage`.
 */
function guardarElemento() {
    const input = document.getElementById("itemInput");
    if (!input || input.value.trim() === "") return;

    const lista = obtenerElementos();
    lista.push(input.value.trim());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    input.value = "";
    renderizarVista();
}

/**
 * Restaura el arreglo original `[1, 2, 3, 4, 5]` en `localStorage`.
 */
function limpiarStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3, 4, 5]));
    renderizarVista();
}

/**
 * Muestra en pantalla y en consola el estado deserializado y su `.toString()`.
 */
function renderizarVista() {
    const datos = obtenerElementos();
    console.log("Arreglo recuperado con JSON.parse:", datos);
    console.log("Representación con Array.toString():", datos.toString());

    const viewer = document.getElementById("storageViewer");
    if (viewer) {
        viewer.textContent = JSON.stringify(datos, null, 2);
    }
}

renderizarVista();
