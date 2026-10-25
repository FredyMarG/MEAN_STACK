/**
 * ============================================================================
 * REPASO JAVASCRIPT: FUNCIONES, ARRAYS Y BUBBLE SORT (Repaso JS/repasojs.js)
 * ============================================================================
 * Propósito: Demostrar declaración de funciones clásicas y funciones flecha,
 * uso del operador ternario, manipulación de arreglos (`.push()`) y el algoritmo
 * clásico de ordenamiento de burbuja (Bubble Sort) de menor a mayor.
 */

// 1. Recorrido de un arreglo heterogéneo en JavaScript
function salude() {
    let elementos = ["juan", 67, true, 34.4, null, undefined, {}, []];
    for (let i = 0; i < elementos.length; i++) {
        console.log(`Índice ${i}:`, elementos[i]);
    }
}

// 2. Función con operador ternario para verificar si un número es par
function ispar(number) {
    return number % 2 === 0
        ? `El valor ${number} es par`
        : `El valor ${number} no es par`;
}
console.log(ispar(2));

// 3. Función flecha (Arrow Function ES6)
const hola1 = () => {
    console.log("Hola desde Arrow Function");
};
hola1();

// 4. Inserción en arreglos con .push()
let nombres = ["Carlos React", "Michael Git", "Daniela Bootstrap"];
nombres.push("Camilo divs");
console.log("Total de estudiantes:", nombres.length);

// 5. ALGORITMO DE ORDENAMIENTO (Bubble Sort / Intercambio directo):
// Organizar los números del arreglo de menor a mayor sin usar .sort()
let array = [23, 45, 78, 32, 12, 1, 4, 8, 34, 32, 1000, 34, 37, 22, 0, -4, -6];
let temp = 0;

for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
        if (array[i] > array[j]) {
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
}

console.log("Arreglo ordenado de menor a mayor:", array);
