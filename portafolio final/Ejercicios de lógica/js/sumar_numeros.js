/**
 * ============================================================================
 * FUNCIONES DE LÓGICA DE PROGRAMACIÓN (Ejercicios de lógica/js/sumar_numeros.js)
 * ============================================================================
 * Contiene la lógica de negocio y manipulación del DOM para 5 ejercicios:
 * 1. `suma()`: Suma acumulativa de 0 hasta N.
 * 2. `esPar()`: Determinación de número par o impar con operador módulo (%).
 * 3. `premio()`: Asignación de premios en pizzería según edad y género.
 * 4. `menu()`: Suma de precios seleccionados mediante checkboxes.
 * 5. `multiplicar()`: Generador dinámico de tablas de multiplicar en el DOM.
 * 6. `promedio()`: Cálculo de descuento de matrícula universitaria.
 */

/**
 * Ejercicio 1: Suma todos los enteros desde 0 hasta el número N ingresado.
 */
function suma() {
    let respuesta = document.querySelector("#respuesta");
    let n = parseInt(document.querySelector("#numero").value);
    let total = 0;
    respuesta.className = "";

    if (isNaN(n) || n < 0) {
        respuesta.className = "w-100 mt-2 text-white bg-danger rounded-2 p-2";
        respuesta.innerHTML = "Por favor ingrese un número entero positivo válido.";
        return;
    }

    for (let i = 0; i <= n; i++) {
        total = total + i;
    }

    respuesta.className = "w-100 mt-2 text-white bg-info rounded-2 p-2";
    respuesta.innerHTML = `El resultado de sumar los números desde 0 hasta ${n} es igual a ${total}`;
}

/**
 * Ejercicio 2: Evalúa si el número ingresado es par o impar.
 */
function esPar() {
    let respuesta = document.querySelector("#respuestaPar");
    let valor = document.querySelector("#par").value;
    let p = parseInt(valor);
    respuesta.className = "";

    if (valor === "" || isNaN(p)) {
        respuesta.innerHTML = "Por favor ingrese un número válido.";
        respuesta.className = "w-100 mt-2 rounded-2 bg-warning text-dark p-2";
        return;
    }

    if (p % 2 === 0) {
        respuesta.innerHTML = `El número ${p} es par`;
        respuesta.className = "w-100 mt-2 rounded-2 bg-success text-white p-2";
    } else {
        respuesta.innerHTML = `El número ${p} es impar`;
        respuesta.className = "w-100 mt-2 rounded-2 bg-danger text-white p-2";
    }
}

/**
 * Ejercicio 3: Determina el premio adicional en una pizzería según edad y sexo.
 * - Menores de 10 años: reclaman un jugo.
 * - Mayores de 18 años (Hombre): cerveza + porción de pizza 3 carnes.
 * - Mayores de 18 años (Mujer): cerveza + porción de pizza hawaiana.
 */
function premio() {
    let edad = parseInt(document.querySelector("#edad").value);
    let hombre = document.querySelector("#hombre");
    let mujer = document.querySelector("#mujer");
    let premio = document.querySelector("#premio");
    premio.className = "";

    if (isNaN(edad) || (!hombre.checked && !mujer.checked)) {
        premio.innerHTML = "Por favor ingrese la edad y seleccione el sexo.";
        premio.className = "w-100 mt-2 rounded-2 bg-warning text-dark p-2";
        return;
    }

    if (edad < 10 && hombre.checked) {
        premio.innerHTML = "El niño es menor de 10 años, debe reclamar un jugo";
        premio.className = "w-100 mt-2 rounded-2 bg-success text-white p-2";
    } else if (edad < 10 && mujer.checked) {
        premio.innerHTML = "La niña es menor de 10 años, debe reclamar un jugo";
        premio.className = "w-100 mt-2 rounded-2 bg-success text-white p-2";
    } else if (edad >= 18 && hombre.checked) {
        premio.innerHTML = "Es hombre y es mayor de edad, debe reclamar una cerveza y adicionalmente una pizza 3 carnes";
        premio.className = "w-100 mt-2 rounded-2 bg-success text-white p-2";
    } else if (edad >= 18 && mujer.checked) {
        premio.innerHTML = "Es mujer y es mayor de edad, debe reclamar una cerveza y adicionalmente una porción de pizza hawaiana";
        premio.className = "w-100 mt-2 rounded-2 bg-success text-white p-2";
    } else {
        premio.innerHTML = "Desafortunadamente no cumples las condiciones para recibir ningún premio (rango de 10 a 17 años)";
        premio.className = "w-100 mt-2 rounded-2 bg-danger text-white p-2";
    }
}

/**
 * Ejercicio 4.1: Calcula el total de los productos marcados con checkbox en el menú.
 */
function menu() {
    let ids = ["pasta", "arroz", "mojarra", "sushi", "pollo", "casuela", "gaseosa", "jugo", "infuciones", "te", "agua_gas", "agua"];
    let suma = 0;
    let p = document.querySelector("#total");

    for (let i = 0; i < ids.length; i++) {
        let checkbox = document.querySelector(`#${ids[i]}`);
        if (checkbox && checkbox.checked) {
            suma += parseInt(checkbox.value);
        }
    }

    p.innerHTML = `El total de la orden es $ ${suma.toLocaleString("es-CO")}`;
    p.className = "w-100 mt-2 rounded-2 bg-info text-white p-2 fw-bold";
}

/**
 * Ejercicio 5: Genera las filas de la tabla de multiplicar limpiando resultados previos.
 */
function multiplicar() {
    let dato = parseInt(document.querySelector("#multiplo").value),
        tbody = document.querySelector("#tbody"),
        final = parseInt(document.querySelector("#final").value);

    // Limpiar la tabla antes de generar una nueva para no duplicar filas
    tbody.innerHTML = "";

    if (isNaN(dato) || isNaN(final) || final < 1) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-danger">Ingrese valores numéricos válidos.</td></tr>`;
        return;
    }

    for (let i = 1; i <= final; i++) {
        let tr = document.createElement("tr");
        let resultado = dato * i;
        tr.innerHTML = `<td>${dato}</td><td>X</td><td>${i}</td><td>=</td><td>${resultado}</td>`;
        tbody.appendChild(tr);
    }
}

/**
 * Ejercicio 6: Calcula el descuento sobre una matrícula base de $1.000.000:
 * - Promedio <= 3.0: 0% de descuento ($1.000.000)
 * - Promedio > 3.0 y <= 4.0: 5% de descuento ($950.000)
 * - Promedio > 4.0 y <= 5.0: 50% de descuento ($500.000)
 * Corrección aplicada: Se corrigió el valor base en promedio <= 3 (antes tenía un cero de más: 10000000).
 */
function promedio() {
    let valorPromedio = parseFloat(document.querySelector("#promedio").value);
    let descuento = document.querySelector("#descuento");
    const VALOR_BASE = 1000000;
    let matricula = 0;
    descuento.className = "";

    if (isNaN(valorPromedio) || valorPromedio < 0 || valorPromedio > 5) {
        descuento.className = "w-100 mt-2 text-dark bg-warning rounded-2 p-2";
        descuento.innerHTML = "Por favor ingrese un promedio válido entre 0.0 y 5.0";
        return;
    }

    if (valorPromedio <= 3) {
        descuento.className = "w-100 mt-2 text-white bg-danger rounded-2 p-2";
        matricula = VALOR_BASE;
        descuento.innerHTML = `Su promedio es ${valorPromedio}, por lo tanto no aplica a ningún tipo de descuento y deberá pagar $${matricula.toLocaleString("es-CO")}`;
    } else if (valorPromedio > 3 && valorPromedio <= 4) {
        descuento.className = "w-100 mt-2 text-white bg-success rounded-2 p-2";
        matricula = VALOR_BASE - (VALOR_BASE * 0.05);
        descuento.innerHTML = `Su promedio es ${valorPromedio}, por lo tanto su descuento es del 5% y deberá pagar $${matricula.toLocaleString("es-CO")}`;
    } else if (valorPromedio > 4) {
        descuento.className = "w-100 mt-2 text-white bg-success rounded-2 p-2";
        matricula = VALOR_BASE - (VALOR_BASE * 0.5);
        descuento.innerHTML = `Su promedio es ${valorPromedio}, por lo tanto su descuento es del 50% y deberá pagar $${matricula.toLocaleString("es-CO")}`;
    }
}
