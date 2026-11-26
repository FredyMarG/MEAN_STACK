/**
 * ============================================================================
 * FUNCIONES DE LÓGICA DE PROGRAMACIÓN (ejercicios-logica/js/sumar_numeros.js)
 * ============================================================================
 * Optimizaciones aplicadas:
 * - `suma()`: Fórmula de Gauss O(1) `n * (n + 1) / 2` con validación entera.
 * - `esPar()`: Validación estricta de número entero (`Number.isInteger`).
 * - `premio()`: Validación de rango de edad realista (`0 <= edad <= 105`).
 * - `multiplicar()`: Inserción eficiente con `DocumentFragment` y límite de 500 filas.
 */

/** 1. Calcula la sumatoria de 0 hasta N usando la fórmula de Gauss en tiempo O(1). */
function suma() {
    const respuesta = document.querySelector("#respuesta");
    const raw = Number(document.querySelector("#numero").value);
    respuesta.className = ""; // Limpia estilos previos

    // Valida que sea entero positivo dentro del rango seguro
    if (!Number.isInteger(raw) || raw < 0 || raw > 100000000) {
        respuesta.className = "w-100 mt-2 text-white bg-danger rounded-2 p-2";
        respuesta.textContent = "Por favor ingrese un número entero positivo válido (0 - 100,000,000).";
        return;
    }

    const total = (raw * (raw + 1)) / 2; // Fórmula de Gauss
    respuesta.className = "w-100 mt-2 text-white bg-info rounded-2 p-2";
    respuesta.textContent = `El resultado de sumar los números desde 0 hasta ${raw} es igual a ${total.toLocaleString("es-CO")}`;
}

/** 2. Determina si el entero ingresado es par o impar mediante el residuo `% 2`. */
function esPar() {
    const respuesta = document.querySelector("#respuestaPar");
    const valor = document.querySelector("#par").value.trim();
    const p = Number(valor);
    respuesta.className = "";

    if (valor === "" || !Number.isInteger(p)) {
        respuesta.textContent = "Por favor ingrese un número entero válido.";
        respuesta.className = "w-100 mt-2 rounded-2 bg-warning text-dark p-2";
        return;
    }

    if (p % 2 === 0) {
        respuesta.textContent = `El número ${p} es par`;
        respuesta.className = "w-100 mt-2 rounded-2 bg-success text-white p-2";
    } else {
        respuesta.textContent = `El número ${p} es impar`;
        respuesta.className = "w-100 mt-2 rounded-2 bg-danger text-white p-2";
    }
}

/** 3. Asigna un premio según la edad y el sexo seleccionado en el formulario. */
function premio() {
    const edad = Number(document.querySelector("#edad").value);
    const hombre = document.querySelector("#hombre");
    const mujer = document.querySelector("#mujer");
    const out = document.querySelector("#premio");
    out.className = "";

    // Verifica edad realista y que al menos un radio button esté marcado
    if (!Number.isInteger(edad) || edad < 0 || edad > 105 || (!hombre.checked && !mujer.checked)) {
        out.textContent = "Por favor ingrese una edad válida (0 - 105) y seleccione el sexo.";
        out.className = "w-100 mt-2 rounded-2 bg-warning text-dark p-2";
        return;
    }

    if (edad < 10) {
        out.textContent = hombre.checked
            ? "El niño es menor de 10 años, debe reclamar un jugo"
            : "La niña es menor de 10 años, debe reclamar un jugo";
        out.className = "w-100 mt-2 rounded-2 bg-success text-white p-2";
    } else if (edad >= 18) {
        out.textContent = hombre.checked
            ? "Es hombre y es mayor de edad, debe reclamar una cerveza y adicionalmente una pizza 3 carnes"
            : "Es mujer y es mayor de edad, debe reclamar una cerveza y adicionalmente una porción de pizza hawaiana";
        out.className = "w-100 mt-2 rounded-2 bg-success text-white p-2";
    } else {
        out.textContent = "Desafortunadamente no cumples las condiciones para recibir ningún premio (rango de 10 a 17 años)";
        out.className = "w-100 mt-2 rounded-2 bg-danger text-white p-2";
    }
}

/** 4. Suma el precio de todos los checkboxes marcados en el menú de restaurante. */
function menu() {
    const ids = ["pasta", "arroz", "mojarra", "sushi", "pollo", "casuela", "gaseosa", "jugo", "infuciones", "te", "agua_gas", "agua"];
    let totalOrden = 0;
    const p = document.querySelector("#total");

    for (const id of ids) {
        const checkbox = document.querySelector(`#${id}`);
        if (checkbox && checkbox.checked) {
            totalOrden += parseInt(checkbox.value, 10) || 0;
        }
    }

    p.textContent = `El total de la orden es $ ${totalOrden.toLocaleString("es-CO")}`;
    p.className = "w-100 mt-2 rounded-2 bg-info text-white p-2 fw-bold";
}

/** 5. Genera la tabla de multiplicar usando `DocumentFragment` para un único reflow del DOM. */
function multiplicar() {
    const dato = Number(document.querySelector("#multiplo").value);
    const tbody = document.querySelector("#tbody");
    const final = Number(document.querySelector("#final").value);

    tbody.innerHTML = "";

    // Protege el navegador limitando la tabla entre 1 y 500 filas
    if (!Number.isFinite(dato) || !Number.isInteger(final) || final < 1 || final > 500) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-danger">Ingrese un número válido y un límite entero entre 1 y 500.</td></tr>`;
        return;
    }

    const frag = document.createDocumentFragment();
    for (let i = 1; i <= final; i++) {
        const tr = document.createElement("tr");
        const cells = [dato, "X", i, "=", dato * i];
        cells.forEach((val) => {
            const td = document.createElement("td");
            td.textContent = String(val); // Inserción segura sin HTML
            tr.appendChild(td);
        });
        frag.appendChild(tr);
    }
    tbody.appendChild(frag);
}

/** 6. Calcula el descuento de matrícula universitaria según promedio académico (0.0 a 5.0). */
function promedio() {
    const valorPromedio = parseFloat(document.querySelector("#promedio").value);
    const descuento = document.querySelector("#descuento");
    const VALOR_BASE = 1000000; // Matrícula base en COP
    let matricula = 0;
    descuento.className = "";

    if (isNaN(valorPromedio) || valorPromedio < 0 || valorPromedio > 5) {
        descuento.className = "w-100 mt-2 text-dark bg-warning rounded-2 p-2";
        descuento.textContent = "Por favor ingrese un promedio válido entre 0.0 y 5.0";
        return;
    }

    if (valorPromedio <= 3) {
        descuento.className = "w-100 mt-2 text-white bg-danger rounded-2 p-2";
        matricula = VALOR_BASE;
        descuento.textContent = `Su promedio es ${valorPromedio}, por lo tanto no aplica a ningún tipo de descuento y deberá pagar $${matricula.toLocaleString("es-CO")}`;
    } else if (valorPromedio <= 4) {
        descuento.className = "w-100 mt-2 text-white bg-success rounded-2 p-2";
        matricula = VALOR_BASE * 0.95; // 5% de descuento
        descuento.textContent = `Su promedio es ${valorPromedio}, por lo tanto su descuento es del 5% y deberá pagar $${matricula.toLocaleString("es-CO")}`;
    } else {
        descuento.className = "w-100 mt-2 text-white bg-success rounded-2 p-2";
        matricula = VALOR_BASE * 0.5; // 50% de descuento
        descuento.textContent = `Su promedio es ${valorPromedio}, por lo tanto su descuento es del 50% y deberá pagar $${matricula.toLocaleString("es-CO")}`;
    }
}
