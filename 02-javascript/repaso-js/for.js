/**
 * ============================================================================
 * ALGORITMO DE CIFRADO ROT13 EN JAVASCRIPT (repaso-js/for.js)
 * ============================================================================
 * Propósito educativo (Curso MEAN Stack):
 * Implementar el cifrado César de desplazamiento +13 (ROT13) con aritmética
 * modular (`% 26`) sobre códigos ASCII:
 * - Mayúsculas A–Z: códigos ASCII 65 al 90.
 * - Minúsculas a–z: códigos ASCII 97 al 122.
 * - Caracteres especiales, tildes y espacios se conservan intactos.
 */

/**
 * Cifra o descifra un texto aplicando rotación de 13 posiciones (ROT13 es simétrico).
 * @param {string} texto - Cadena de entrada a transformar.
 * @returns {string} Cadena resultante tras aplicar ROT13.
 */
function rot13(texto = "") {
  const input = String(texto);
  let resultado = "";

  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i); // Obtiene el código numérico ASCII/UTF-16

    if (code >= 65 && code <= 90) {
      // Convierte rango 65..90 a 0..25, suma 13, aplica módulo 26 y vuelve a 65..90
      resultado += String.fromCharCode(((code - 65 + 13) % 26) + 65);
    } else if (code >= 97 && code <= 122) {
      // Misma lógica circular para minúsculas en el rango 97..122
      resultado += String.fromCharCode(((code - 97 + 13) % 26) + 97);
    } else {
      // Espacios, números o signos de puntuación permanecen iguales
      resultado += input[i];
    }
  }
  return resultado;
}

// Guardia CommonJS: solo imprime la demo si se ejecuta directamente con Node.js
if (require.main === module) {
  const entrada = "Hola Mundo MEAN Stack";
  const cifrado = rot13(entrada);
  const descifrado = rot13(cifrado);
  console.log({ entrada, cifrado, descifrado });
}

module.exports = { rot13 };
