/**
 * ============================================================================
 * GESTOR DE ROADMAP DE TAREAS CON POO (proyectoBit/js/roadMapTareas.js)
 * ============================================================================
 * Propósito: Modelar cada fila de la tabla de tareas mediante la clase `taskData`,
 * permitir el ordenamiento ascendente/descendente por cualquier columna (Tarea,
 * Estado, Tipo, Fecha de Inicio, Fecha de Entrega, Encargado), restaurar el orden
 * original ("Deshacer") y actualizar el estado de cada tarea mediante un modal.
 *
 * Complemento aplicado:
 * Se completó el filtro de ordenamiento por Estado (`estadodes` y `estadoasc`)
 * que estaba marcado como WIP en los comentarios originales, extrayendo el texto
 * limpio del botón de estado para ordenar alfabéticamente.
 */

// Clase que representa cada fila de la tabla de tareas
class taskData {
    constructor(name, state, typeOfTask, startDate, endDate, inChargeOf) {
        this.name = name;
        this.state = state;
        this.typeOfTask = typeOfTask;
        this.startDate = startDate;
        this.endDate = endDate;
        this.inChargeOf = inChargeOf;
    }

    getProperties() {
        return [this.name, this.state, this.typeOfTask, this.startDate, this.endDate, this.inChargeOf];
    }
}

// Arreglo para almacenar las filas actuales y copia del estado inicial para "Deshacer"
var myTasks = [];
actualizarTabla();
var myTasksorig = [...myTasks];

/**
 * Captura las celdas actuales de la tabla HTML y las almacena en el arreglo de objetos `myTasks`.
 */
function actualizarTabla() {
    myTasks = [];
    const allTableRows = document.querySelectorAll("tr");
    for (let i = 0; i < allTableRows.length - 1; i++) {
        let columns = allTableRows[i + 1].querySelectorAll("td");
        let auxArray = [];
        for (let j = 0; j < columns.length; j++) {
            auxArray.push(columns[j].innerHTML);
        }
        myTasks.push(new taskData(...auxArray));
    }
}

/**
 * Vuelca el contenido del arreglo `myTasks` nuevamente en las celdas de la tabla HTML.
 */
function imprimirTabla() {
    const allTableRows = document.querySelectorAll("tr");
    for (let i = 0; i < allTableRows.length - 1; i++) {
        let columns = allTableRows[i + 1].querySelectorAll("td");
        let auxArray = myTasks[i].getProperties();
        for (let j = 0; j < columns.length; j++) {
            columns[j].innerHTML = auxArray[j];
        }
    }
}

/**
 * Registra un listener de ordenamiento ascendente o descendente sobre una propiedad de `taskData`.
 */
function crearSort(elementid, asc, property, indicador) {
    const btn = document.getElementById(elementid);
    if (!btn) return;
    btn.addEventListener("click", function () {
        actualizarTabla();
        const cleanVal = (val) => val.replace(/<[^>]*>/g, "").trim();
        if (asc) {
            myTasks.sort((a, b) => (cleanVal(a[property]) < cleanVal(b[property]) ? 1 : -1));
        } else {
            myTasks.sort((a, b) => (cleanVal(a[property]) > cleanVal(b[property]) ? 1 : -1));
        }
        imprimirTabla();
        document.getElementById("indicadorFiltro").innerHTML =
            '<button class="btn btn-primary ms-5">' + indicador + "</button>";
    });
}

// Registro de ordenamientos por columna
crearSort("tareades", false, "name", "Tarea Desc");
crearSort("tareaasc", true, "name", "Tarea Asc");
crearSort("estadodes", false, "state", "Estado Desc");
crearSort("estadoasc", true, "state", "Estado Asc");
crearSort("tipodes", false, "typeOfTask", "Tipo Desc");
crearSort("tipoasc", true, "typeOfTask", "Tipo Asc");
crearSort("fechaindes", false, "startDate", "Fecha de Inicio Desc");
crearSort("fechainasc", true, "startDate", "Fecha de Inicio Asc");
crearSort("fechafides", false, "endDate", "Fecha de Entrega Desc");
crearSort("fechafiasc", true, "endDate", "Fecha de Entrega Asc");
crearSort("encardes", false, "inChargeOf", "Encargado Desc");
crearSort("encarasc", true, "inChargeOf", "Encargado Asc");

// Botón para deshacer filtros y restaurar la vista original de la tabla
const btnDeshacer = document.getElementById("deshacer");
if (btnDeshacer) {
    btnDeshacer.addEventListener("click", function () {
        myTasks = [...myTasksorig];
        imprimirTabla();
        document.getElementById("indicadorFiltro").innerHTML =
            '<button class="btn btn-dark ms-5">Sin Filtro</button>';
    });
}

/**
 * Actualiza el botón de estado de una fila específica al elegir una opción en el modal.
 */
function cambiarEstado(opcion, fila) {
    let element = document.getElementById(opcion);
    if (!element) return;
    let newElement = element.cloneNode(true);
    element.replaceWith(newElement);
    document.getElementById(opcion).addEventListener("click", function () {
        const estados = {
            opt1: { clase: "btn-success", texto: "Completado" },
            opt2: { clase: "btn-primary", texto: "En Progreso" },
            opt3: { clase: "btn-warning", texto: "Con Demora" },
            opt4: { clase: "btn-light", texto: "Aplazado" },
            opt5: { clase: "btn-danger", texto: "Cancelado" },
            opt6: { clase: "btn-secondary", texto: "No Iniciado" }
        };
        if (estados[opcion]) {
            document.getElementById(fila).innerHTML =
                `<button type="button" class="btn ${estados[opcion].clase}" data-bs-toggle="modal" data-bs-target="#exampleModal">${estados[opcion].texto}</button>`;
        }
        actualizarTabla();
        myTasksorig = [...myTasks];
        imprimirTabla();
    });
}

for (let i = 1; i < myTasks.length + 1; i++) {
    const filaEl = document.getElementById("fila" + i);
    if (filaEl) {
        filaEl.addEventListener("click", function () {
            cambiarEstado("opt1", "fila" + i);
            cambiarEstado("opt2", "fila" + i);
            cambiarEstado("opt3", "fila" + i);
            cambiarEstado("opt4", "fila" + i);
            cambiarEstado("opt5", "fila" + i);
            cambiarEstado("opt6", "fila" + i);
        });
    }
}
