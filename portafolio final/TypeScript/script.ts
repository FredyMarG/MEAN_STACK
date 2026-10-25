/**
 * ============================================================================
 * INTRODUCCIÓN A TYPESCRIPT: TIPADO ESTÁTICO E INTERFACES (TypeScript/script.ts)
 * ============================================================================
 * Propósito: Demostrar el tipado explícito en TypeScript (`string`, `number`,
 * `interface`) frente a la transpilación a JavaScript ES5/ES6 (`script.js`).
 * Nota: Se incluye `export {}` para declarar alcance de módulo y evitar colisión
 * de variables globales con `script.js` en el servidor de lenguaje de VS Code.
 */

let text: string = "hello ts";
console.log(text);

// Complemento: Ejemplo de interfaz y función tipada en TypeScript
interface Developer {
    name: string;
    stack: string[];
    active: boolean;
}

const developer: Developer = {
    name: "Fredy Martinez",
    stack: ["MongoDB", "Express", "Angular", "Node.js"],
    active: true
};

console.log(`Desarrollador: ${developer.name} (${developer.stack.join(", ")})`);

export {};
