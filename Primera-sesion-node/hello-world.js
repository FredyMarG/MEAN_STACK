/**
 * ============================================================================
 * PRIMERA SESIÓN DE NODE.JS: LÓGICA Y ALGORITMOS EN CONSOLA (hello-world.js)
 * ============================================================================
 * Propósito educativo (Curso MEAN Stack):
 * Enseñar fundamentos de JavaScript ejecutados directamente en Node.js:
 * 1. Validación numérica segura (`typeof`, `Number.isFinite`) y comparación estricta (`===`).
 * 2. Condicionales (`if / else if / else`) y operador módulo (`%` = residuo).
 * 3. Bucles `for` simples y anidados (filas/columnas y horas/minutos).
 * 4. Formateo de texto con `padStart(2, "0")`, arreglos `.join(",")` y template literals.
 * 5. Optimización de números primos en complejidad O(n * sqrt(n)).
 * 6. Exportación de módulo CommonJS (`module.exports`) y guardia `require.main === module`.
 */

/**
 * 1. Evalúa si un valor es un número finito positivo, negativo o cero.
 * @param {number} valor - Número a evaluar (por defecto 30).
 * @returns {"positivo"|"negativo"|"cero"|"invalido"}
 */
function evaluarSigno(valor = 30) {
  // Verifica primero que sea de tipo `number` y no sea NaN, Infinity o -Infinity
  if (typeof valor !== "number" || !Number.isFinite(valor)) {
    console.log(`${valor}: No es un número válido`);
    return "invalido";
  }

  // Si es mayor a 0, el signo es positivo
  if (valor > 0) {
    console.log(`${valor}: El valor es positivo`);
    return "positivo";
  }

  // Si es menor a 0, el signo es negativo
  if (valor < 0) {
    console.log(`${valor}: El valor es negativo`);
    return "negativo";
  }

  // Si llegó aquí siendo número finito, obligatoriamente vale exactamente 0
  console.log("El valor es igual a 0");
  return "cero";
}

/**
 * 2. Determina si un número es par o impar usando el operador módulo (`%`).
 * @param {number} valor - Número a evaluar (por defecto 30).
 * @returns {"par"|"impar"|"invalido"}
 */
function evaluarParidad(valor = 30) {
  // Rechaza textos, undefined, NaN o infinitos antes de calcular el residuo
  if (typeof valor !== "number" || !Number.isFinite(valor)) {
    console.log(`${valor}: No es un número válido`);
    return "invalido";
  }

  // `valor % 2` devuelve el residuo de dividir entre 2; si es 0 exacto (`===`), es par
  if (valor % 2 === 0) {
    console.log(`${valor}: El número es par`);
    return "par";
  }

  // En cualquier otro caso (residuo 1 o -1), el número es impar
  console.log(`${valor}: Es impar`);
  return "impar";
}

/**
 * 3. Variante clásica de FizzBuzz:
 * - Múltiplo de 3 y de 5 a la vez -> "XD"
 * - Solo múltiplo de 5 -> "D"
 * - Solo múltiplo de 3 -> "X"
 * - Ninguno -> devuelve el mismo número convertido a texto.
 * @param {number} valor - Número a evaluar (por defecto 15).
 * @returns {string}
 */
function multiplosXD(valor = 15) {
  // Valida que la entrada sea un número finito
  if (typeof valor !== "number" || !Number.isFinite(valor)) {
    return "invalido";
  }

  // Valor por defecto si no es múltiplo ni de 3 ni de 5
  let salida = String(valor);

  // IMPORTANTE: evaluamos `&&` primero; si evaluáramos `% 3` antes, el 15 daría "X" y no "XD"
  if (valor % 3 === 0 && valor % 5 === 0) salida = "XD";
  else if (valor % 5 === 0) salida = "D";
  else if (valor % 3 === 0) salida = "X";

  // Imprime la correspondencia número -> etiqueta y retorna la etiqueta
  console.log(`${valor} -> ${salida}`);
  return salida;
}

/**
 * 4. Dibuja un cuadrado hueco de asteriscos usando dos bucles `for` anidados.
 * @param {number} lado - Índice máximo de filas/columnas (por defecto 5 -> 6x6).
 * @returns {string[]} Arreglo con cada línea dibujada.
 */
function dibujarCuadrado(lado = 5) {
  // Garantiza un tamaño mínimo entero de 1 para evitar bucles vacíos o decimales
  const n = Math.max(1, Math.floor(lado));
  // Arreglo donde almacenaremos cada fila construida para poder retornarla y testearla
  const filas = [];
  console.log("\n--- Cuadrado de Asteriscos ---");

  // Bucle externo: recorre cada fila `i` desde 0 hasta `n`
  for (let i = 0; i <= n; i++) {
    // Acumulador de caracteres de la fila actual
    let fila = "";
    // Bucle interno: recorre cada columna `j` desde 0 hasta `n`
    for (let j = 0; j <= n; j++) {
      // Imprime `*` solo en los 4 bordes (primera/última fila o primera/última columna); dentro pone espacio
      fila += i === 0 || i === n || j === 0 || j === n ? "*" : " ";
    }
    // Guarda la fila terminada en el arreglo y la imprime en consola
    filas.push(fila);
    console.log(fila);
  }
  return filas;
}

/**
 * 5. Genera e imprime la tabla de multiplicar del 5 (del 0 al 10).
 * @returns {string[]} Arreglo con las 11 operaciones formateadas.
 */
function tablaDelCinco() {
  // Arreglo para almacenar cada línea generada
  const lineas = [];
  console.log("\n--- Tabla del 5 ---");

  // Recorre los multiplicadores del 0 al 10 inclusive
  for (let i = 0; i <= 10; i++) {
    // Interpola el resultado usando template literals (`...`)
    const linea = `5 * ${i} = ${5 * i}`;
    lineas.push(linea);
    console.log(linea);
  }
  return lineas;
}

/**
 * 6. Simula un reloj digital de 24 horas (`00:00` a `23:59`).
 * @param {boolean} mostrarMuestra - `true` imprime cada 6 horas; `false` los 1440 minutos.
 * @returns {string[]} Lista de marcas horarias generadas.
 */
function relojDigital(mostrarMuestra = true) {
  // Almacena las horas formateadas como "HH:MM"
  const horas = [];
  console.log("\n--- Reloj Digital (Muestra) ---");

  // Bucle externo: horas del día de 0 a 23
  for (let i = 0; i <= 23; i++) {
    // Bucle interno: minutos de cada hora de 0 a 59
    for (let j = 0; j <= 59; j++) {
      // `padStart(2, "0")` antepone un "0" si el número tiene un solo dígito (ej. 6 -> "06")
      const hh = String(i).padStart(2, "0");
      const mm = String(j).padStart(2, "0");
      const marca = `${hh}:${mm}`;

      // Si `mostrarMuestra` es true, solo guarda/imprime cada 6 horas en punto (00:00, 06:00, 12:00, 18:00)
      if (!mostrarMuestra || (j === 0 && i % 6 === 0)) {
        horas.push(marca);
        console.log(marca);
      }
    }
  }
  return horas;
}

/**
 * 7. Construye una serie del 0 al 100 separada por comas sin coma final.
 * @returns {string} Cadena `"0,1,2,...,100"`.
 */
function serieCien() {
  // Arreglo temporal: evita concatenar strings manualmente en cada vuelta
  const numeros = [];
  // Agrega los enteros desde 0 hasta 100
  for (let i = 0; i <= 100; i++) {
    numeros.push(i);
  }
  // `.join(",")` une todos los elementos poniendo `,` únicamente entre ellos (sin coma al final)
  const resultado = numeros.join(",");
  console.log("\n--- Serie 0 al 100 ---\n" + resultado);
  return resultado;
}

/**
 * 8. Calcula todos los números primos desde 2 hasta `limite`.
 * Optimización O(n * sqrt(n)): ningún número `i` tiene un divisor propio mayor
 * que su raíz cuadrada sin tener otro divisor menor o igual a `Math.sqrt(i)`.
 * @param {number} limite - Límite superior a evaluar (por defecto 100).
 * @returns {number[]} Arreglo con los números primos encontrados.
 */
function primosHasta(limite = 100) {
  // Almacena los números primos encontrados
  const primos = [];

  // Evalúa cada candidato `i` empezando en 2 (el primer número primo)
  for (let i = 2; i <= limite; i++) {
    let esPrimo = true;
    // Solo hace falta buscar divisores hasta la raíz cuadrada de `i`
    const tope = Math.sqrt(i);

    for (let j = 2; j <= tope; j++) {
      // Si `i % j === 0`, `j` divide exactamente a `i`, por lo que no es primo
      if (i % j === 0) {
        esPrimo = false;
        break; // Termina el bucle interno de inmediato para ahorrar iteraciones
      }
    }

    // Si ningún divisor lo dividió exactamente, se agrega al arreglo de primos
    if (esPrimo) primos.push(i);
  }

  console.log(`\n--- Primos hasta ${limite} ---\n` + primos.join(", "));
  return primos;
}

// `require.main === module` solo es verdadero al ejecutar `node hello-world.js` directo;
// cuando otro archivo (como `tests/hello-world.test.js`) hace `require()`, este bloque no corre.
if (require.main === module) {
  evaluarSigno(30);
  evaluarParidad(30);
  multiplosXD(15);
  dibujarCuadrado(5);
  tablaDelCinco();
  relojDigital(true);
  serieCien();
  primosHasta(100);
}

// Exporta las 8 funciones para poder importarlas desde pruebas o desde otros scripts Node.js
module.exports = {
  evaluarSigno,
  evaluarParidad,
  multiplosXD,
  dibujarCuadrado,
  tablaDelCinco,
  relojDigital,
  serieCien,
  primosHasta,
};
