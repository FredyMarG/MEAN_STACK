/**
 * ============================================================================
 * TEMPORIZADOR POMODORO (proyectoBit/js/carlos.js)
 * ============================================================================
 * Propósito: Controlar el reloj Pomodoro de la aplicación "Procrastination Nightmare"
 * alternando entre modo TRABAJO (25 min -> 24:59) y modo DESCANSO (5 min -> 04:59),
 * con botón de inicio/pausa (`START` / `STOP`) gestionado por `setInterval`.
 *
 * Mejora aplicada:
 * Se agregó formateo con cero a la izquierda (`String(seconds).padStart(2, "0")`)
 * para que los segundos menores a 10 se visualicen como `24:09` en lugar de `24:9`.
 */

const time = document.querySelector("#time-text-pomodoro");
const startButtom = document.querySelector("#startButton");
const workButtom = document.querySelector("#button-work");
const restButtom = document.querySelector("#button-rest");

let seconds = 59;
let minutes = 24;
let bloqueo = 0;

var intervalId = null;

/**
 * Formatea minutos y segundos en formato MM:SS.
 */
function formatTime(m, s) {
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Configurar sesión de Trabajo (25 minutos)
workButtom.addEventListener("click", () => {
    seconds = 59;
    minutes = 24;
    time.textContent = formatTime(minutes, seconds);
    clearInterval(intervalId);
    bloqueo = 0;
    startButtom.innerHTML = "<h3>START</h3>";
});

// Configurar sesión de Descanso (5 minutos)
restButtom.addEventListener("click", () => {
    seconds = 59;
    minutes = 4;
    time.textContent = formatTime(minutes, seconds);
    clearInterval(intervalId);
    bloqueo = 0;
    startButtom.innerHTML = "<h3>START</h3>";
});

// Iniciar o pausar el temporizador
startButtom.addEventListener("click", () => {
    bloqueo++;
    if (bloqueo === 1) {
        startButtom.innerHTML = "<h3>STOP</h3>";
        intervalId = setInterval(() => {
            seconds--;
            if (seconds === 0 && minutes !== -1) {
                seconds = 59;
                minutes--;
            }
            if (minutes === -1) {
                clearInterval(intervalId);
                time.textContent = "End";
                bloqueo = 0;
                startButtom.innerHTML = "<h3>START</h3>";
            } else {
                time.textContent = formatTime(minutes, seconds);
            }
        }, 1000);
    } else {
        clearInterval(intervalId);
        startButtom.innerHTML = "<h3>START</h3>";
        bloqueo = 0;
    }
});
