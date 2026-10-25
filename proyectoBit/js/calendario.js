/**
 * ============================================================================
 * ARCHIVO: calendario.js (proyectoBit/js/calendario.js)
 * DESCRIPCIÓN: Controlador interactivo para el módulo de Calendario de Eventos
 *              de Procrastination Nightmare.
 * FUNCIONALIDADES:
 *   1. Inicialización de Popovers de Bootstrap en los eventos del calendario.
 *   2. Creación de nuevos eventos desde el modal (#k-agregar-event-modal),
 *      agregándolos a la lista lateral, al selector de subtareas y a la celda
 *      del día correspondiente en el calendario.
 *   3. Filtrado dinámico de la lista de eventos por color de categoría.
 *   4. Cambio dinámico de subtareas según el evento seleccionado y barra de
 *      progreso de subtareas completadas.
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // Mapa de subtareas por evento
  const subtasksByEvent = {
    "Nuevo excel": [
      "Abrir el archivo de Excel con los datos de ventas",
      "Seleccionar los datos que se desean mostrar en la gráfica",
      "Hacer clic en la pestaña Insertar gráfico de barras",
      "Asegurarse de que la gráfica esté clara y fácil de entender",
      "Guardar y compartir la gráfica con el equipo"
    ],
    "Reunion": [
      "Definir agenda y objetivos del sprint con el equipo",
      "Revisar bloqueos actuales de desarrollo",
      "Asignar responsables a los entregables pendientes",
      "Enviar minuta de acuerdos por correo"
    ],
    "Crear figma": [
      "Diseñar wireframes de baja fidelidad",
      "Definir paleta de colores y tipografía en Figma",
      "Crear componentes interactivos para el prototipo",
      "Validar flujo de usuario con el cliente"
    ],
    "Crear registro": [
      "Diseñar estructura de campos del formulario de asistencia",
      "Configurar validaciones de correo y documento",
      "Realizar pruebas de guardado en base de datos"
    ],
    "Presentacion": [
      "Investigar casos de uso de IA en la industria",
      "Preparar diapositivas ejecutivas con métricas",
      "Ensayar demostración en vivo del proyecto"
    ]
  };

  // Inicializar popovers de Bootstrap
  function initPopovers() {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    [...popoverTriggerList].forEach((el) => {
      if (!bootstrap.Popover.getInstance(el)) {
        new bootstrap.Popover(el);
      }
    });
  }
  initPopovers();

  // Referencias del DOM
  const eventListContainer = document.querySelector(".k-event-list");
  const filterRadios = document.querySelectorAll('.col.bg-card input[name="k-event-color"]');
  const eventSelect = document.querySelector(".col.bg-card select.form-select");
  const modalEl = document.getElementById("k-agregar-event-modal");

  // Mapa de clases de color
  const colorClasses = ["bg-primary", "bg-septenary", "bg-quaternary", "bg-quinary", "bg-senary"];

  // 1. Filtrado por color en la tarjeta lateral
  filterRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const selectedBg = colorClasses.find((cls) => radio.classList.contains(cls));
      const events = eventListContainer.querySelectorAll(".k-event");
      events.forEach((ev) => {
        if (!selectedBg || ev.classList.contains(selectedBg)) {
          ev.classList.remove("d-none");
          ev.classList.add("d-flex");
        } else {
          ev.classList.remove("d-flex");
          ev.classList.add("d-none");
        }
      });
    });

    // Doble clic en un radio restablece el filtro para mostrar todos
    radio.addEventListener("dblclick", () => {
      radio.checked = false;
      eventListContainer.querySelectorAll(".k-event").forEach((ev) => {
        ev.classList.remove("d-none");
        ev.classList.add("d-flex");
      });
    });
  });

  // 2. Renderizado dinámico de subtareas al cambiar el evento seleccionado
  const subtaskContainer = document.createElement("div");
  subtaskContainer.id = "dynamic-subtasks-list";
  const existingChecks = document.querySelectorAll(".col.bg-card .text-white.d-flex.gap-3.pb-3.pt-3");
  if (existingChecks.length > 0) {
    existingChecks[0].parentNode.insertBefore(subtaskContainer, existingChecks[0]);
    existingChecks.forEach((el) => el.remove());
  }

  function renderSubtasks(eventName) {
    const tasks = subtasksByEvent[eventName] || [
      `Planificar actividades para "${eventName}"`,
      "Ejecutar tarea principal",
      "Verificar entrega y resultados"
    ];
    subtaskContainer.innerHTML = tasks
      .map(
        (text, idx) => `
        <div class="text-white d-flex gap-3 pb-2 pt-2 align-items-center">
          <input type="checkbox" class="form-check-input k-checkbox mt-0" id="subtaskCheck${idx}" />
          <label class="form-check-label" for="subtaskCheck${idx}" style="cursor:pointer;">${text}</label>
        </div>
      `
      )
      .join("");

    subtaskContainer.querySelectorAll("input[type='checkbox']").forEach((chk) => {
      chk.addEventListener("change", () => {
        const lbl = chk.nextElementSibling;
        if (lbl) {
          lbl.style.textDecoration = chk.checked ? "line-through" : "none";
          lbl.style.opacity = chk.checked ? "0.6" : "1";
        }
      });
    });
  }

  if (eventSelect) {
    // Normalizar los valores de las opciones al nombre visible
    Array.from(eventSelect.options).forEach((opt) => {
      opt.value = opt.textContent.trim();
    });
    renderSubtasks(eventSelect.value);
    eventSelect.addEventListener("change", (e) => {
      renderSubtasks(e.target.value);
    });
  }

  // 3. Agregar nuevo evento desde el modal
  if (modalEl) {
    const addBtn = modalEl.querySelector(".btn.btn-primary");
    const titleInput = modalEl.querySelector('input[placeholder="Titulo*"]');
    const dateInputs = modalEl.querySelectorAll('input[type="datetime-local"]');
    const descInput = modalEl.querySelector("#k-event-txt-area");
    const modalColorRadios = modalEl.querySelectorAll('input[name="k-event-color"]');

    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const title = titleInput ? titleInput.value.trim() : "";
        if (!title) {
          alert("Por favor ingresa un título para el evento.");
          return;
        }

        // Determinar color seleccionado
        let chosenColor = "bg-primary";
        modalColorRadios.forEach((r) => {
          if (r.checked) {
            const found = colorClasses.find((c) => r.classList.contains(c));
            if (found) chosenColor = found;
          }
        });

        // Formatear fecha y hora
        let dayNum = "15";
        let formattedTime = "15 Mar - 10 : 00 AM";
        if (dateInputs[0] && dateInputs[0].value) {
          const dt = new Date(dateInputs[0].value);
          if (!isNaN(dt.getTime())) {
            dayNum = String(dt.getDate()).padStart(2, "0");
            const hours = dt.getHours();
            const mins = String(dt.getMinutes()).padStart(2, "0");
            const ampm = hours >= 12 ? "PM" : "AM";
            const hr12 = String(hours % 12 || 12).padStart(2, "0");
            formattedTime = `${dayNum} Mar - ${hr12} : ${mins} ${ampm}`;
          }
        }

        const desc = descInput && descInput.value.trim()
          ? descInput.value.trim()
          : "Evento programado desde el calendario.";

        // 3.1 Agregar a la lista lateral de eventos
        if (eventListContainer) {
          const item = document.createElement("div");
          item.className = `k-event ${chosenColor} d-flex gap-3 p-3 rounded-3 glow`;
          item.innerHTML = `
            <span class="k-event-time fw-bold">${formattedTime}</span>
            <span class="k-event-text">${title}</span>
          `;
          eventListContainer.prepend(item);
        }

        // 3.2 Agregar al selector de subtareas
        subtasksByEvent[title] = [
          desc,
          "Preparar recursos necesarios",
          "Completar y marcar seguimiento"
        ];
        if (eventSelect) {
          const opt = document.createElement("option");
          opt.value = title;
          opt.textContent = title;
          eventSelect.appendChild(opt);
          eventSelect.value = title;
          renderSubtasks(title);
        }

        // 3.3 Insertar insignia con Popover en la celda del día del calendario
        const dayCells = document.querySelectorAll(".k-container-day .col");
        for (const cell of dayCells) {
          const spanDay = cell.querySelector("span");
          if (spanDay && spanDay.textContent.trim() === dayNum && !cell.classList.contains("text-notificaciones")) {
            const wrapper = document.createElement("div");
            wrapper.className = "text-center mt-1";
            wrapper.innerHTML = `
              <button
                type="button"
                class="btn btn-lg ${chosenColor} p-2 rounded-3 w-100"
                data-bs-toggle="popover"
                data-bs-title="${title}"
                data-bs-content="Tarea: ${desc}"
                data-bs-custom-class="custom-popover"
              >
                <span class="d-none d-md-inline k-event-text text-white">${title}</span>
                <span class="d-md-none k-event-text text-white">+</span>
              </button>
            `;
            cell.appendChild(wrapper);
            initPopovers();
            break;
          }
        }

        // Limpiar campos y cerrar el modal
        if (titleInput) titleInput.value = "";
        if (descInput) descInput.value = "";
        dateInputs.forEach((inp) => (inp.value = ""));
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
      });
    }
  }
});
