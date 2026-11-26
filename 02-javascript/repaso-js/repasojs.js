/**
 * ============================================================================
 * REPASO DE ALGORITMOS EN JAVASCRIPT (repaso-js/repasojs.js)
 * ============================================================================
 * Propósito educativo (Curso MEAN Stack):
 * Demostrar funciones con parámetros por defecto y el algoritmo Bubble Sort
 * optimizado con corte temprano (`swapped`), sin mutar el arreglo original.
 */

/**
 * Genera e imprime un saludo personalizado.
 * @param {string} nombre
 * @returns {string}
 */
function salude(nombre = "Desarrollador MEAN") {
  const msg = `¡Hola, ${nombre}!`;
  console.log(msg);
  return msg;
}

/**
 * Ordena un arreglo numérico de menor a mayor usando Bubble Sort optimizado:
 * - Copia el arreglo con `[...arr]` para no mutar la entrada original.
 * - Reduce el límite interno (`- i`) porque los mayores ya quedan al final.
 * - Usa la bandera `swapped` para detenerse en O(n) si ya estaba ordenado.
 * @param {number[]} arr
 * @returns {number[]} Nuevo arreglo ordenado ascendentemente.
 */
function bubbleSort(arr = []) {
  const copy = [...arr];

  for (let i = 0; i < copy.length; i++) {
    let swapped = false; // Indica si hubo al menos un intercambio en esta pasada

    for (let j = 0; j < copy.length - 1 - i; j++) {
      if (copy[j] > copy[j + 1]) {
        // Intercambio moderno por desestructuración sin variable temporal
        [copy[j], copy[j + 1]] = [copy[j + 1], copy[j]];
        swapped = true;
      }
    }

    // Si en toda la pasada no hubo intercambios, el arreglo ya está ordenado
    if (!swapped) break;
  }

  return copy;
}

if (require.main === module) {
  salude("Fredy Martinez");
  console.log("Ordenado:", bubbleSort([64, 34, 25, 12, 22, 11, 90]));
}

module.exports = { salude, bubbleSort };
