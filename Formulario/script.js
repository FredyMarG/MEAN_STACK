/**
 * ============================================================================
 * LÓGICA DE VALIDACIÓN Y ALMACENAMIENTO DEL FORMULARIO (Formulario/script.js)
 * ============================================================================
 * Propósito: Validar campos obligatorios, cambiar dinámicamente el color del
 * botón según el género seleccionado (azul para hombre, rosado para mujer),
 * habilitar el campo "Otro cargo", almacenar cada registro en una lista de
 * objetos JSON y limpiar el formulario tras cada envío exitoso.
 *
 * Correcciones aplicadas:
 * 1. Se corrigió la condición `if (cargo.value == "otros")` que antes impedía
 *    alcanzar el bloque `else if (cargo.value == "otros" && otro.value != "")`.
 * 2. Se aplicó la clase `.btn-pink` definida en el CSS cuando se selecciona Mujer.
 * 3. Se agregó el arreglo `listaAspirantes` para cumplir el requerimiento de
 *    almacenar los objetos JSON dentro de una lista y vaciar el formulario.
 */

const nombre = document.querySelector("#nombre");
const apellido = document.querySelector("#apellido");
const aspiracion = document.querySelector("#aspiracion");
const correo = document.querySelector("#correo");
const hombre = document.querySelector("#hombre");
const mujer = document.querySelector("#mujer");
const cargo = document.querySelector("#cargo");

const alertDOMCorrect = document.querySelector("#alertCorrect");
const alertDOMIncorrect = document.querySelector("#alertIncorrect");

const btn_submit = document.querySelector("#submit");
const otro = document.querySelector("#otro");
const listaRegistros = document.querySelector("#listaRegistros");

// Lista donde se almacenan todos los aspirantes registrados
const listaAspirantes = [];
let objeto = {};

/**
 * Activa el botón de envío en color azul (Bootstrap btn-primary) para género masculino.
 */
function blue() {
    if (hombre.checked) {
        btn_submit.classList.remove("d-none", "btn-pink", "btn-danger");
        btn_submit.classList.add("btn-primary", "btn");
    }
}

/**
 * Activa el botón de envío en color rosado (.btn-pink) para género femenino.
 */
function pink() {
    if (mujer.checked) {
        btn_submit.classList.remove("d-none", "btn-primary");
        btn_submit.classList.add("btn-pink", "btn");
    }
}

/**
 * Muestra u oculta el campo de texto adicional cuando el usuario elige "otros" en Cargo.
 */
cargo.addEventListener("change", () => {
    if (cargo.value === "otros") {
        otro.classList.remove("d-none");
    } else {
        otro.classList.add("d-none");
        otro.value = "";
    }
});

/**
 * Valida el formulario, guarda el objeto en la lista JSON y limpia los campos.
 */
btn_submit.addEventListener("click", (e) => {
    e.preventDefault();

    const cargoSeleccionado = cargo.value === "otros" ? otro.value.trim() : cargo.value;

    // Validación de todos los campos obligatorios
    if (
        nombre.value.trim() !== "" &&
        apellido.value.trim() !== "" &&
        aspiracion.value.trim() !== "" &&
        correo.value.trim() !== "" &&
        (hombre.checked || mujer.checked) &&
        cargoSeleccionado !== ""
    ) {
        objeto = {
            nombre: nombre.value.trim(),
            apellido: apellido.value.trim(),
            aspiracion: Number(aspiracion.value),
            email: correo.value.trim(),
            genero: hombre.checked ? "Masculino" : "Femenino",
            cargo: cargoSeleccionado
        };

        // Guardar en la lista de objetos JSON
        listaAspirantes.push(objeto);
        console.log("Lista actualizada de aspirantes:", listaAspirantes);

        // Mostrar alerta de éxito
        alertDOMCorrect.classList.remove("d-none");
        alertDOMIncorrect.classList.add("d-none");

        // Renderizar en la lista visual
        if (listaRegistros) {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `
                <div>
                    <strong>${objeto.nombre} ${objeto.apellido}</strong> (${objeto.genero}) — <span class="badge bg-secondary">${objeto.cargo}</span>
                    <div class="small text-muted">${objeto.email}</div>
                </div>
                <span class="fw-bold text-success">$${objeto.aspiracion.toLocaleString("es-CO")}</span>
            `;
            listaRegistros.appendChild(li);
        }

        // Vaciar el formulario para un nuevo registro
        document.querySelector("#registroForm").reset();
        otro.classList.add("d-none");
        btn_submit.classList.add("d-none");
    } else {
        alertDOMCorrect.classList.add("d-none");
        alertDOMIncorrect.classList.remove("d-none");
    }
});
