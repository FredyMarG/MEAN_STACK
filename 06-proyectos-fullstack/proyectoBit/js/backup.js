/**
 * ============================================================================
 * RESPALDO GLOBAL EN JSON (proyectoBit/js/backup.js)
 * ============================================================================
 * Propósito: Permitir exportar e importar en un único archivo `.json` todo el
 * progreso almacenado en `localStorage` por los módulos de Procrastination
 * Nightmare (Pomodoro, Lista de Tareas, Notas, Hábitos, Calendario y Roadmap),
 * además de actualizar las métricas del Dashboard (`index.html`).
 */

(() => {
  // Lista centralizada de claves persistidas por la suite
  const SUITE_KEYS = [
    "proyectoBit_pomodoros",
    "proyectoBit_todos_v1",
    "proyectoBit_notas_v1",
    "proyectoBit_habitos_v1",
    "proyectoBit_calendar_state_v1",
    "proyectoBit_roadmap_data_v2",
    "proyectoBit_roadmap_title_v2"
  ];

  const exportBtn = document.getElementById("btnExportBackup");
  const importInput = document.getElementById("inputImportBackup");
  const statusEl = document.getElementById("backupStatusMsg");

  /**
   * Actualiza los contadores en vivo del Dashboard leyendo desde `localStorage`.
   */
  function refreshDashboardMetrics() {
    try {
      const pomEl = document.getElementById("dashPomodoros");
      const todoEl = document.getElementById("dashTodos");
      const habEl = document.getElementById("dashHabitos");
      const roadEl = document.getElementById("dashRoadmap");

      if (pomEl) pomEl.textContent = localStorage.getItem("proyectoBit_pomodoros") || "0";
      if (todoEl) {
        const todos = JSON.parse(localStorage.getItem("proyectoBit_todos_v1") || "[]");
        todoEl.textContent = String(Array.isArray(todos) ? todos.filter((t) => !t.done).length : 0);
      }
      if (habEl) {
        const habitos = JSON.parse(localStorage.getItem("proyectoBit_habitos_v1") || "[]");
        habEl.textContent = String(Array.isArray(habitos) && habitos.length ? habitos.length : 3);
      }
      if (roadEl) {
        const roadmap = JSON.parse(localStorage.getItem("proyectoBit_roadmap_data_v2") || "[]");
        roadEl.textContent = String(Array.isArray(roadmap) && roadmap.length ? roadmap.length : 6);
      }
    } catch {
      // Si alguna clave contiene JSON inválido se ignora sin romper el Dashboard
    }
  }

  /**
   * Muestra un mensaje temporal de confirmación o error junto a los botones de respaldo.
   * @param {string} msg - Texto a mostrar.
   * @param {boolean} isError - `true` para estilo de error, `false` para éxito.
   */
  function showStatus(msg, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = `small mt-2 ${isError ? "text-danger" : "text-info"}`;
  }

  // Exportación a archivo JSON descargable
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const payload = {
        app: "Procrastination Nightmare",
        exportedAt: new Date().toISOString(),
        data: {}
      };

      SUITE_KEYS.forEach((key) => {
        const val = localStorage.getItem(key);
        if (val !== null) payload.data[key] = val;
      });

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `procrastination-nightmare-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showStatus("✅ Respaldo JSON descargado correctamente.");
    });
  }

  // Importación y validación de archivo JSON
  if (importInput) {
    importInput.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result || "{}"));
          if (!parsed || typeof parsed.data !== "object") {
            throw new Error("El archivo no tiene el formato de respaldo esperado.");
          }

          let restored = 0;
          SUITE_KEYS.forEach((key) => {
            if (typeof parsed.data[key] === "string") {
              localStorage.setItem(key, parsed.data[key]);
              restored++;
            }
          });

          refreshDashboardMetrics();
          showStatus(`✅ Respaldo restaurado (${restored} módulos actualizados).`);
        } catch (err) {
          showStatus(`✖ Error al importar: ${err.message}`, true);
        } finally {
          importInput.value = "";
        }
      };
      reader.readAsText(file);
    });
  }

  refreshDashboardMetrics();
})();
