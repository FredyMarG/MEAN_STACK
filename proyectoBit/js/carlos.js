/**
 * ============================================================================
 * TEMPORIZADOR POMODORO (proyectoBit/js/carlos.js)
 * ============================================================================
 * Propósito: Controlar el reloj Pomodoro de "Procrastination Nightmare"
 * alternando entre modo TRABAJO (25:00) y modo DESCANSO (05:00), con anillo
 * circular de progreso animado, contador de sesiones en `localStorage` y
 * alarma sonora mediante Web Audio API.
 */

(() => {
  // Referencias a los elementos del DOM del temporizador
  const timeEl = document.querySelector("#time-text-pomodoro");
  const startButton = document.querySelector("#startButton");
  const resetButton = document.querySelector("#resetButton");
  const workButton = document.querySelector("#btn-work") || document.querySelector("#button-work");
  const restButton = document.querySelector("#btn-rest") || document.querySelector("#button-rest");
  const ringEl = document.querySelector("#pomodoroRing");
  const modeLabel = document.querySelector("#pomodoroModeLabel");
  const statusText = document.querySelector("#pomodoroStatusText");
  const sessionsBadge = document.querySelector("#pomodoroSessionsBadge");

  // Guardia de seguridad: evita errores en páginas sin temporizador Pomodoro
  if (!timeEl || !startButton || !workButton || !restButton) return;

  let currentModeMinutes = 25;
  let totalSeconds = 25 * 60;
  let intervalId = null;

  /**
   * Formatea una cantidad total de segundos en formato `MM:SS` con cero a la izquierda.
   * @param {number} secs - Segundos restantes.
   * @returns {string}
   */
  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  /**
   * Actualiza la variable CSS `--progress` del anillo circular y el contador
   * de sesiones completadas almacenado en `localStorage`.
   */
  function updateRingAndSessions() {
    if (ringEl) {
      const pct = Math.max(0, Math.min(100, (totalSeconds / (currentModeMinutes * 60)) * 100));
      ringEl.style.setProperty("--progress", `${pct}%`);
    }
    if (sessionsBadge) {
      const completed = Number(localStorage.getItem("proyectoBit_pomodoros") || 0);
      sessionsBadge.textContent = `${completed} ${completed === 1 ? "sesión hoy" : "sesiones hoy"}`;
    }
  }

  /**
   * Genera un tono suave de notificación al finalizar el ciclo usando Web Audio API
   * (sin requerir archivos de audio externos).
   */
  function playChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Silencia el error si el navegador bloquea reproducción automática
    }
  }

  /**
   * Emite una notificación nativa del navegador (si el usuario concedió permiso)
   * al finalizar un ciclo de trabajo o descanso.
   */
  function notifyBrowser() {
    try {
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification("Procrastination Nightmare", {
          body: currentModeMinutes === 25 ? "¡Ciclo de enfoque completado! Tómate un descanso." : "¡Descanso terminado! Hora de volver al enfoque."
        });
      }
    } catch {}
  }

  /**
   * Detiene el intervalo activo y restablece el botón principal a `START`.
   * @param {string} statusMsg - Mensaje de estado visible bajo el reloj.
   */
  function stopTimer(statusMsg = "Pausado") {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    startButton.textContent = "▶ START";
    if (statusText) statusText.textContent = statusMsg;
  }

  /**
   * Cambia entre modo Trabajo (25 min) y Descanso (5 min) reiniciando el reloj.
   * @param {number} minutes - Duración del modo en minutos.
   */
  function setMode(minutes) {
    currentModeMinutes = minutes;
    totalSeconds = minutes * 60;
    stopTimer("Listo para iniciar");
    timeEl.textContent = formatTime(totalSeconds);
    workButton.classList.toggle("active", minutes === 25);
    restButton.classList.toggle("active", minutes === 5);
    if (modeLabel) {
      modeLabel.textContent = minutes === 25 ? "🔥 Modo Enfoque (25 min)" : "☕ Modo Descanso (5 min)";
    }
    updateRingAndSessions();
  }

  // Inicialización de vista al cargar la página
  timeEl.textContent = formatTime(totalSeconds);
  updateRingAndSessions();

  workButton.addEventListener("click", () => setMode(25));
  restButton.addEventListener("click", () => setMode(5));
  if (resetButton) {
    resetButton.addEventListener("click", () => setMode(currentModeMinutes));
  }

  // Control de inicio/pausa de la cuenta regresiva
  startButton.addEventListener("click", () => {
    if (intervalId) {
      stopTimer("En pausa");
      return;
    }

    if (totalSeconds <= 0) {
      totalSeconds = currentModeMinutes * 60;
      timeEl.textContent = formatTime(totalSeconds);
    }

    // Solicita permiso de notificaciones la primera vez que el usuario inicia el reloj
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    startButton.textContent = "⏸ PAUSAR";
    if (statusText) statusText.textContent = currentModeMinutes === 25 ? "Enfocado..." : "Descansando...";

    intervalId = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds--;
        timeEl.textContent = formatTime(totalSeconds);
        updateRingAndSessions();
      }
      if (totalSeconds === 0) {
        stopTimer("¡Ciclo completado!");
        timeEl.textContent = "00:00";
        playChime();
        notifyBrowser();
        const completed = Number(localStorage.getItem("proyectoBit_pomodoros") || 0) + 1;
        localStorage.setItem("proyectoBit_pomodoros", String(completed));
        updateRingAndSessions();
      }
    }, 1000);
  });
})();
