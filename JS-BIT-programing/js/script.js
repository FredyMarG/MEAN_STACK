/**
 * ============================================================================
 * ALGORITMO DE BÚSQUEDA DEL SIGUIENTE NÚMERO PRIMO (JS-BIT-programing/js/script.js)
 * ============================================================================
 * Enunciado: Dado un número, construir un algoritmo que imprima el siguiente
 * número primo a ese. Si el número ingresado por el usuario no es primo, debe
 * indicarle al usuario que el número no es primo y cuál es el próximo primo.
 *
 * Correcciones aplicadas respecto a la versión original:
 * 1. En el bucle interno `for (let j = 1; j <= i; j++)`, se corrigió el inicio en
 *    `j = 1` (antes iniciaba en `j = 0`, donde `i % 0` produce `NaN`).
 * 2. Se corrigió la condición `numero < 1` que impedía mostrar el mensaje para
 *    números compuestos mayores a 1.
 */

/**
 * Verifica si un número entero n es primo contando sus divisores exactos.
 * @param {number} n
 * @returns {boolean}
 */
function esNumeroPrimo(n) {
    if (n < 2) return false;
    let divisores = 0;
    for (let j = 1; j <= n; j++) {
        if (n % j === 0) {
            divisores += 1;
        }
    }
    return divisores === 2;
}

/**
 * Encuentra el siguiente número primo estrictamente mayor a `numero`.
 * Por el Postulado de Bertrand, para todo n > 1 existe un primo p tal que n < p < 2n.
 * @param {number} numero
 * @returns {{ esPrimoActual: boolean, siguientePrimo: number }}
 */
function analizarPrimo(numero) {
    const esPrimoActual = esNumeroPrimo(numero);
    let siguientePrimo = numero + 1;

    while (!esNumeroPrimo(siguientePrimo)) {
        siguientePrimo++;
    }

    return { esPrimoActual, siguientePrimo };
}

/**
 * Ejecuta el flujo desde la interfaz gráfica sin bloquear la página con `prompt()`.
 */
function calcularDesdeInput() {
    const input = document.getElementById("numInput");
    const contenedor = document.getElementById("resultadoPrimo");
    const numero = parseInt(input.value);

    if (isNaN(numero) || numero < 1) {
        contenedor.innerHTML = `<div class="alert alert-warning">Por favor ingresa un entero positivo.</div>`;
        return;
    }

    const { esPrimoActual, siguientePrimo } = analizarPrimo(numero);
    if (esPrimoActual) {
        contenedor.innerHTML = `
            <div class="alert alert-success mb-0">
                ✅ El número <strong>${numero}</strong> ES primo.<br>
                El siguiente número primo es <strong>${siguientePrimo}</strong>.
            </div>`;
    } else {
        contenedor.innerHTML = `
            <div class="alert alert-info mb-0">
                ℹ️ El número <strong>${numero}</strong> NO es primo.<br>
                El próximo número primo es <strong>${siguientePrimo}</strong>.
            </div>`;
    }
}

/**
 * Mantiene el comportamiento original mediante `window.prompt()` y `alert()`.
 */
function ejecutarConPrompt() {
    let numero = parseInt(window.prompt("Ingrese un número:", ""));
    if (isNaN(numero) || numero < 1) return;

    const { esPrimoActual, siguientePrimo } = analizarPrimo(numero);
    if (esPrimoActual) {
        alert(`El número ${numero} es primo. El siguiente número primo es ${siguientePrimo}`);
    } else {
        alert(`El número ${numero} no es primo. El próximo primo es ${siguientePrimo}`);
    }
}
