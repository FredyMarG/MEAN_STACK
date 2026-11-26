/**
 * ============================================================================
 * CONTROLADOR DE MENÚ POR TEXTO (ejercicios-logica/js/script.js)
 * ============================================================================
 * Propósito: Permitir escribir platos del menú para acumular su precio.
 * Mejoras aplicadas:
 * - Uso de `textContent` para prevenir XSS al mostrar entradas del usuario.
 * - Soporte para tecla `Enter` en el input `#plato`.
 * - Reinicio automático de la orden al finalizar con "Pagar".
 */

// Referencias al campo de texto, botón de envío y párrafo de respuesta
const input = document.querySelector("#plato");
const btn_enviar = document.querySelector("#btn_enviar");
const p = document.querySelector("#p");

// Arreglo de precios leídos directamente desde el HTML
const precio = [
    parseInt(document.querySelector("#arroz")?.textContent || "0", 10),
    parseInt(document.querySelector("#pasta")?.textContent || "0", 10),
    parseInt(document.querySelector("#tacos")?.textContent || "0", 10),
    parseInt(document.querySelector("#carne")?.textContent || "0", 10),
    parseInt(document.querySelector("#burger")?.textContent || "0", 10),
    parseInt(document.querySelector("#papas")?.textContent || "0", 10)
];

// Nombres de platos paralelos al arreglo `precio`
const comida = [
    "Arroz Chino",
    "Pasta con Champiñones",
    "Tacos al pastor",
    "Carne a la parrilla",
    "Hamburguesa doble con queso",
    "Salchipapas"
];

// Estado acumulado de la orden actual
let total = [];
let suma = 0;

/** Procesa el plato escrito o cierra la cuenta si el usuario escribe "Pagar". */
function procesarOrden(e) {
    if (e) e.preventDefault();
    const valorIngresado = input.value.trim();
    if (!valorIngresado) return;

    // Cierra la orden y reinicia acumuladores al escribir "pagar"
    if (valorIngresado.toLowerCase() === "pagar") {
        p.className = "w-100 mt-2 rounded-2 bg-info text-white p-2 fw-bold";
        p.textContent = `El total de la cuenta es $${suma.toLocaleString("es-CO")} (${total.length} platos). Orden reiniciada.`;
        total = [];
        suma = 0;
        input.value = "";
        return;
    }

    // Busca el plato sin distinguir mayúsculas/minúsculas
    const idx = comida.findIndex((item) => item.toLowerCase() === valorIngresado.toLowerCase());
    if (idx !== -1) {
        total.push(precio[idx]);
        suma += precio[idx];
        p.className = "w-100 mt-2 rounded-2 bg-success text-white p-2";
        p.textContent = `✅ Agregado: ${comida[idx]} ($${precio[idx].toLocaleString("es-CO")}). Subtotal: $${suma.toLocaleString("es-CO")}. Escribe "Pagar" para finalizar.`;
        input.value = "";
    } else {
        p.className = "w-100 mt-2 rounded-2 bg-warning text-dark p-2";
        p.textContent = `⚠️ El plato "${valorIngresado}" no está en el menú. Verifica el nombre o escribe "Pagar".`;
    }
}

// Conecta eventos de clic y tecla Enter sobre el input
if (btn_enviar && input) {
    btn_enviar.addEventListener("click", procesarOrden);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") procesarOrden(e);
    });
}
