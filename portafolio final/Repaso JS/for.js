/**
 * ============================================================================
 * REPASO JAVASCRIPT: CIFRADO ROT13 Y CICLOS (Repaso JS/for.js)
 * ============================================================================
 * Propósito: Practicar iteración con `for...of`, conversión de caracteres a
 * código ASCII (`charCodeAt()`) y reconstrucción de cadenas (`String.fromCharCode()`)
 * aplicando un desplazamiento de +13 posiciones (cifrado César / ROT13), además
 * de bucles anidados, funciones con parámetros y retorno de objetos.
 *
 * Correcciones aplicadas:
 * 1. En el bucle `for (let pos of txt)`, la variable `ascci` tenía alcance de
 *    bloque (`let`), por lo que `console.log(ascci)` fuera del bucle lanzaba
 *    `ReferenceError: ascci is not defined`. Ahora se imprime `ert` (el texto cifrado).
 * 2. En la función `pareja()`, se corrigió el typo `return { incommig, text }`
 *    a `return { incomming, text }`.
 */

let txt = "Michael";
let ert = "";
let arr = ["A", "r", "r", "a", "y"];

// Desplazamiento ASCII +13 sobre cada carácter de la cadena `txt`
for (let pos of txt) {
    let ascci = pos.charCodeAt(0);
    ascci = ascci + 13;
    ert += String.fromCharCode(ascci);
}

console.log(`Texto original: ${txt} -> Texto desplazado (+13 ASCII): ${ert}`);

// Ejemplo de función con múltiples parámetros y Template Literals
function nombre(param1, param2, param3, param4) {
    console.log(`Tu nombre es ${param1} ${param2} ${param3} ${param4}`);
}
nombre("Fredy", "Martinez", "FullStack", "MEAN");

// Ejemplo de función que retorna un objeto abreviado (Object Property Shorthand)
function pareja(mensaje) {
    let incomming = mensaje;
    let text = "Hola mundo desde JS";
    return { incomming, text };
}

console.log(pareja("Mensaje de entrada"));
