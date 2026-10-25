/**
 * ============================================================================
 * PRIMERA SESIÓN DE NODE.JS: LÓGICA Y ALGORITMOS EN CONSOLA (hello-world.js)
 * ============================================================================
 * Propósito: Recopilación de ejercicios fundamentales de lógica ejecutables
 * directamente con `node hello-world.js`:
 * 1. Operadores de comparación y lógicos (`=`, `==`, `===`, `&&`, `||`).
 * 2. Clasificación de un número en positivo, negativo o cero.
 * 3. Determinación de paridad (`% 2 === 0`).
 * 4. Variante FizzBuzz ("X" para múltiplos de 3, "D" para múltiplos de 5, "XD" para ambos).
 * 5. Dibujo de un cuadrado hueco de asteriscos en consola con bucles anidados.
 * 6. Tabla de multiplicar del 5 con template literals.
 * 7. Simulador de reloj digital de 24 horas (`00:00` a `23:59`).
 * 8. Serie de números del 0 al 100 separados por coma sin coma final.
 * 9. Cálculo de los números primos entre 2 y 1000.
 *
 * Complemento: Se encapsuló cada ejercicio en una función exportable y documentada
 * para que todos puedan ejecutarse y demostrarse limpiamente en consola.
 */

// 1. Evaluar si un número es positivo, negativo o cero
function evaluarSigno(valor = 30) {
    if (valor > 0) {
        console.log(`${valor}: El valor es positivo`);
    } else if (valor < 0) {
        console.log(`${valor}: El valor es negativo`);
    } else {
        console.log("El valor es igual a 0 o no es un número");
    }
}

// 2. Evaluar si un número es par o impar
function evaluarParidad(valor = 30) {
    if (valor % 2 === 0) {
        console.log(`${valor}: El número es par`);
    } else {
        console.log(`${valor}: Es impar`);
    }
}

// 3. Múltiplos de 3 ("X"), de 5 ("D") o de ambos ("XD")
function multiplosXD(valor = 15) {
    if (valor % 3 === 0 && valor % 5 === 0) {
        console.log(`${valor} -> XD`);
    } else if (valor % 5 === 0) {
        console.log(`${valor} -> D`);
    } else if (valor % 3 === 0) {
        console.log(`${valor} -> X`);
    }
}

// 4. Dibujar un cuadrado hueco de 6x6 con asteriscos
function dibujarCuadrado(lado = 5) {
    console.log("\n--- Cuadrado de Asteriscos ---");
    for (let i = 0; i <= lado; i++) {
        let fila = "";
        for (let j = 0; j <= lado; j++) {
            if (i === 0 || i === lado || j === 0 || j === lado) {
                fila += "*";
            } else {
                fila += " ";
            }
        }
        console.log(fila);
    }
}

// 5. Tabla del 5
function tablaDelCinco() {
    console.log("\n--- Tabla del 5 ---");
    for (let i = 0; i <= 10; i++) {
        console.log(`5 * ${i} = ${5 * i}`);
    }
}

// 6. Reloj digital con las horas del día (00:00 a 23:59)
function relojDigital(mostrarMuestra = true) {
    console.log("\n--- Reloj Digital (Muestra) ---");
    for (let i = 0; i <= 23; i++) {
        for (let j = 0; j <= 59; j++) {
            const hh = i < 10 ? `0${i}` : `${i}`;
            const mm = j < 10 ? `0${j}` : `${j}`;
            if (!mostrarMuestra || (j === 0 && i % 6 === 0)) {
                console.log(`${hh}:${mm}`);
            }
        }
    }
}

// 7. Números del 0 al 100 separados por coma
function serieCien() {
    let string = "";
    for (let i = 0; i <= 100; i++) {
        string += i === 100 ? `${i}` : `${i},`;
    }
    console.log("\n--- Serie 0 al 100 ---\n" + string);
}

// 8. Números primos hasta N (por defecto 1000)
function primosHasta(limite = 100) {
    const primos = [];
    for (let i = 2; i <= limite; i++) {
        let divisores = 0;
        for (let j = 1; j <= i; j++) {
            if (i % j === 0) {
                divisores += 1;
            }
        }
        if (divisores === 2) {
            primos.push(i);
        }
    }
    console.log(`\n--- Primos hasta ${limite} ---\n` + primos.join(", "));
}

// Ejecución de demostración al correr con Node.js
evaluarSigno(30);
evaluarParidad(30);
multiplosXD(15);
dibujarCuadrado(5);
tablaDelCinco();
relojDigital(true);
serieCien();
primosHasta(100);
