/**
 * ============================================================================
 * CONTROLADOR DE MENÚ POR TEXTO (Ejercicios de lógica/js/script.js)
 * ============================================================================
 * Propósito: Permitir que el usuario escriba nombres de platos del menú para
 * ir acumulando su precio en una orden. Cuando escribe "Pagar" o "pagar",
 * muestra el total acumulado en pantalla.
 *
 * Mejoras y correcciones aplicadas:
 * 1. Se corrigió `e.preventDefault` a `e.preventDefault()` para invocar el método.
 * 2. Se normalizó la comparación con `.trim().toLowerCase()` para aceptar mayúsculas
 *    o minúsculas sin errores de coincidencia.
 * 3. Se corrigió el cálculo de `suma` evitando sumar elementos cuando el plato
 *    ingresado no existe en el menú, y mostrando retroalimentación de plato agregado.
 */

let input = document.querySelector("#plato"),
    btn_enviar = document.querySelector("#btn_enviar"),
    p = document.querySelector("#p"),
    arroz = parseInt(document.querySelector("#arroz").innerHTML),
    pasta = parseInt(document.querySelector("#pasta").innerHTML),
    tacos = parseInt(document.querySelector("#tacos").innerHTML),
    carne = parseInt(document.querySelector("#carne").innerHTML),
    burger = parseInt(document.querySelector("#burger").innerHTML),
    papas = parseInt(document.querySelector("#papas").innerHTML),
    precio = [arroz, pasta, tacos, carne, burger, papas],
    comida = [
        "Arroz Chino",
        "Pasta con Champiñones",
        "Tacos al pastor",
        "Carne a la parrilla",
        "Hamburguesa doble con queso",
        "Salchipapas"
    ],
    total = [],
    suma = 0;

btn_enviar.addEventListener("click", (e) => {
    e.preventDefault();

    const valorIngresado = input.value.trim();

    // Si el usuario escribe "pagar", mostramos el total acumulado
    if (valorIngresado.toLowerCase() === "pagar") {
        p.className = "w-100 mt-2 rounded-2 bg-info text-white p-2 fw-bold";
        p.innerHTML = `El total de la cuenta es $${suma.toLocaleString("es-CO")} (${total.length} platos)`;
        input.value = "";
        return;
    }

    // Buscamos si el plato ingresado coincide con alguno del menú
    let platoEncontrado = false;
    for (let i = 0; i < comida.length; i++) {
        if (valorIngresado.toLowerCase() === comida[i].toLowerCase()) {
            total.push(precio[i]);
            suma += precio[i];
            platoEncontrado = true;
            p.className = "w-100 mt-2 rounded-2 bg-success text-white p-2";
            p.innerHTML = `✅ Agregado: ${comida[i]} ($${precio[i].toLocaleString("es-CO")}). Subtotal: $${suma.toLocaleString("es-CO")}. Escribe "Pagar" para finalizar.`;
            input.value = "";
            break;
        }
    }

    if (!platoEncontrado) {
        p.className = "w-100 mt-2 rounded-2 bg-warning text-dark p-2";
        p.innerHTML = `⚠️ El plato "${valorIngresado}" no está en el menú. Verifica el nombre o escribe "Pagar".`;
    }
});
