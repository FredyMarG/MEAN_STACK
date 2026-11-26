/**
 * ============================================================================
 * ALGORITMO DE BÚSQUEDA DEL SIGUIENTE NÚMERO PRIMO (JS-BIT-programing/js/script.js)
 * ============================================================================
 * Propósito educativo (Curso MEAN Stack):
 * - Verificar primalidad en O(sqrt(n)) devolviendo además el primer divisor
 *   exacto cuando el número es compuesto y la cantidad de iteraciones.
 * - Calcular los siguientes 5 números primos y medir el tiempo en milisegundos.
 * - Proteger el navegador con un límite seguro (`MAX_NUM = 1_000_000_000`).
 */

const MAX_NUM = 1_000_000_000;
const historial = [];

/**
 * Evalúa si `n` es primo en tiempo O(sqrt(n)).
 * @param {number} n - Entero positivo a evaluar.
 * @returns {{ esPrimo: boolean, divisor: number|null, iteraciones: number }}
 */
function evaluarPrimalidad(n) {
  if (!Number.isInteger(n) || n < 2) return { esPrimo: false, divisor: null, iteraciones: 0 };
  if (n === 2) return { esPrimo: true, divisor: null, iteraciones: 1 };
  if (n % 2 === 0) return { esPrimo: false, divisor: 2, iteraciones: 1 };

  let iteraciones = 1;
  const limite = Math.sqrt(n);
  // Solo prueba divisores impares desde 3 hasta la raíz cuadrada de n
  for (let j = 3; j <= limite; j += 2) {
    iteraciones++;
    if (n % j === 0) {
      return { esPrimo: false, divisor: j, iteraciones };
    }
  }
  return { esPrimo: true, divisor: null, iteraciones };
}

/**
 * Analiza `numero`, encuentra los próximos 5 primos y mide la latencia en ms.
 * @param {number} numero
 */
function analizarPrimo(numero) {
  const t0 = performance.now();
  const detalle = evaluarPrimalidad(numero);
  const siguientes = [];
  let candidato = Math.max(2, numero + 1);

  // Busca los próximos 5 números primos mayores que `numero`
  while (siguientes.length < 5) {
    if (evaluarPrimalidad(candidato).esPrimo) {
      siguientes.push(candidato);
    }
    candidato++;
  }

  const tiempoMs = (performance.now() - t0).toFixed(3);
  return {
    esPrimoActual: detalle.esPrimo,
    divisor: detalle.divisor,
    iteraciones: detalle.iteraciones,
    siguientePrimo: siguientes[0],
    proximosCinco: siguientes,
    tiempoMs
  };
}

/** Agrega un número al historial visual reciente (máximo 6 elementos). */
function registrarEnHistorial(numero, esPrimo) {
  if (!historial.some((h) => h.numero === numero)) {
    historial.unshift({ numero, esPrimo });
    if (historial.length > 6) historial.pop();
  }

  const box = document.getElementById("historialBox");
  const tags = document.getElementById("historialTags");
  if (!box || !tags || historial.length === 0) return;

  box.classList.remove("d-none");
  tags.innerHTML = historial
    .map(
      (item) => `
      <button type="button" class="btn btn-sm ${item.esPrimo ? "btn-outline-success" : "btn-outline-info"}"
        onclick="document.getElementById('numInput').value=${item.numero}; calcularDesdeInput();">
        ${item.numero} ${item.esPrimo ? "✓" : "·"}
      </button>`
    )
    .join("");
}

/** Lee `#numInput`, valida rango seguro y renderiza el análisis completo. */
function calcularDesdeInput() {
  const input = document.getElementById("numInput");
  const contenedor = document.getElementById("resultadoPrimo");
  const numero = Number(input.value);

  if (!input.value.trim() || !Number.isInteger(numero) || numero < 1 || numero > MAX_NUM) {
    contenedor.innerHTML = `<div class="alert alert-warning mb-0">Ingresa un entero positivo entre 1 y ${MAX_NUM.toLocaleString("es-CO")}.</div>`;
    return;
  }

  const info = analizarPrimo(numero);
  registrarEnHistorial(numero, info.esPrimoActual);

  const explicacion = info.esPrimoActual
    ? `✅ El número <strong>${numero.toLocaleString("es-CO")}</strong> <strong>ES primo</strong>.`
    : info.divisor
    ? `ℹ️ El número <strong>${numero.toLocaleString("es-CO")}</strong> NO es primo (${info.divisor} × ${(numero / info.divisor).toLocaleString("es-CO")} = ${numero.toLocaleString("es-CO")}).`
    : `ℹ️ El número <strong>${numero}</strong> NO es primo (los primos comienzan en 2).`;

  contenedor.innerHTML = `
    <div class="alert ${info.esPrimoActual ? "alert-success" : "alert-info"} mb-3">
      <div class="mb-1">${explicacion}</div>
      <div class="small">Siguiente primo: <strong>${info.siguientePrimo.toLocaleString("es-CO")}</strong></div>
    </div>
    <div class="p-3 rounded-3 bg-dark border border-secondary small">
      <div class="text-secondary mb-1">Próximos 5 primos:</div>
      <div class="text-info fw-bold mb-2">${info.proximosCinco.map((p) => p.toLocaleString("es-CO")).join(" • ")}</div>
      <div class="d-flex justify-content-between text-secondary">
        <span>Iteraciones O(√n): <strong>${info.iteraciones}</strong></span>
        <span>Tiempo: <strong>${info.tiempoMs} ms</strong></span>
      </div>
    </div>
  `;
}

/** Variante interactiva clásica usando `prompt()` y `alert()`. */
function ejecutarConPrompt() {
  const numero = Number(window.prompt("Ingrese un número entero positivo (máx. 1,000,000,000):", ""));
  if (!Number.isInteger(numero) || numero < 1 || numero > MAX_NUM) return;

  const { esPrimoActual, siguientePrimo } = analizarPrimo(numero);
  if (esPrimoActual) {
    alert(`El número ${numero} es primo. El siguiente número primo es ${siguientePrimo}`);
  } else {
    alert(`El número ${numero} no es primo. El próximo primo es ${siguientePrimo}`);
  }
}

// Conecta la tecla Enter y ejecuta un análisis inicial al cargar
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("numInput");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        calcularDesdeInput();
      }
    });
    calcularDesdeInput();
  }
});
