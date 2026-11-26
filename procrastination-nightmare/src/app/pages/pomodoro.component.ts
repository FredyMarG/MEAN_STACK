/**
 * ============================================================================
 * COMPONENTE TEMPORIZADOR POMODORO (src/app/pages/pomodoro.component.ts)
 * ============================================================================
 * Propósito: Reloj Pomodoro con anillo circular animado (`conic-gradient`),
 * modos Trabajo (25m) y Descanso (5m), alarma Web Audio API, notificaciones
 * nativas del navegador y contador de sesiones completadas.
 */

import { Component, OnDestroy } from '@angular/core';
import { SuiteStorageService } from '../services/suite-storage.service';

@Component({
  selector: 'app-pomodoro',
  template: `
    <div class="pn-card p-4 text-white text-center mx-auto" style="max-width: 560px;">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <span class="badge bg-info bg-opacity-25 text-info border border-info border-opacity-25 px-3 py-2">
          {{ modoMinutos === 25 ? '🔥 Modo Enfoque (25 min)' : '☕ Modo Descanso (5 min)' }}
        </span>
        <span class="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25 px-3 py-2">
          {{ sesiones }} {{ sesiones === 1 ? 'sesión hoy' : 'sesiones hoy' }}
        </span>
      </div>

      <div class="d-flex justify-content-center gap-3 my-3">
        <button type="button" class="btn rounded-pill px-4 fw-bold"
          [ngClass]="modoMinutos === 25 ? 'btn-info text-dark' : 'btn-outline-info'"
          (click)="seleccionarModo(25)">
          TRABAJO (25m)
        </button>
        <button type="button" class="btn rounded-pill px-4 fw-bold"
          [ngClass]="modoMinutos === 5 ? 'btn-success' : 'btn-outline-success'"
          (click)="seleccionarModo(5)">
          DESCANSO (5m)
        </button>
      </div>

      <div class="d-flex justify-content-center my-4">
        <div class="pn-ring" [style.background]="'conic-gradient(#38bdf8 ' + progresoPct + '%, rgba(148,163,184,0.15) 0)'">
          <div class="pn-ring-inner">
            <h3 class="mb-0 fw-bold" style="font-size: 3.75rem;">{{ tiempoFormateado }}</h3>
            <small class="text-secondary">{{ estadoTexto }}</small>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-center gap-3">
        <button type="button" class="btn btn-info text-dark fw-bold rounded-pill px-5 py-2" (click)="toggleTimer()">
          {{ enEjecucion ? '⏸ PAUSAR' : '▶ START' }}
        </button>
        <button type="button" class="btn btn-outline-light rounded-pill px-4 py-2" (click)="seleccionarModo(modoMinutos)">
          ↺ REINICIAR
        </button>
      </div>
    </div>
  `,
  styles: [`
    .pn-ring {
      width: 240px; height: 240px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 36px rgba(56, 189, 248, 0.2);
      transition: background 0.3s ease;
    }
    .pn-ring-inner {
      width: 214px; height: 214px; border-radius: 50%; background: #0f172a;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
  `]
})
export class PomodoroComponent implements OnDestroy {
  modoMinutos = 25;
  segundosRestantes = 25 * 60;
  enEjecucion = false;
  estadoTexto = 'Listo para iniciar';
  sesiones = this.storage.getPomodoros();
  private timerId: ReturnType<typeof setInterval> | null = null;

  constructor(private storage: SuiteStorageService) {}

  /** Formatea `segundosRestantes` en cadena `MM:SS` con cero a la izquierda. */
  get tiempoFormateado(): string {
    const m = Math.floor(this.segundosRestantes / 60).toString().padStart(2, '0');
    const s = (this.segundosRestantes % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  /** Porcentaje restante para dibujar el anillo `conic-gradient`. */
  get progresoPct(): number {
    return Math.max(0, Math.min(100, (this.segundosRestantes / (this.modoMinutos * 60)) * 100));
  }

  /** Cambia entre modo Trabajo (25m) y Descanso (5m) reiniciando el temporizador. */
  seleccionarModo(min: number): void {
    this.pausar('Listo para iniciar');
    this.modoMinutos = min;
    this.segundosRestantes = min * 60;
  }

  /** Inicia o pausa la cuenta regresiva; solicita permiso de notificaciones si aplica. */
  toggleTimer(): void {
    if (this.enEjecucion) {
      this.pausar('En pausa');
      return;
    }

    if (this.segundosRestantes <= 0) {
      this.segundosRestantes = this.modoMinutos * 60;
    }

    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    this.enEjecucion = true;
    this.estadoTexto = this.modoMinutos === 25 ? 'Enfocado...' : 'Descansando...';

    this.timerId = setInterval(() => {
      if (this.segundosRestantes > 0) {
        this.segundosRestantes--;
      }
      if (this.segundosRestantes === 0) {
        this.pausar('¡Ciclo completado!');
        this.playChime();
        this.notifyBrowser();
        this.sesiones = this.storage.incrementPomodoros();
      }
    }, 1000);
  }

  /** Detiene el intervalo activo y actualiza el texto de estado. */
  private pausar(msg: string): void {
    this.enEjecucion = false;
    this.estadoTexto = msg;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  /** Emite una alerta sonora breve mediante Web Audio API al completar el ciclo. */
  private playChime(): void {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {}
  }

  /** Envía una notificación nativa del navegador si el usuario concedió permiso. */
  private notifyBrowser(): void {
    try {
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification('Procrastination Nightmare', {
          body: this.modoMinutos === 25 ? '¡Ciclo de enfoque completado!' : '¡Descanso terminado!'
        });
      }
    } catch {}
  }

  /** Limpia el `setInterval` al destruir el componente para evitar fugas de memoria. */
  ngOnDestroy(): void {
    this.pausar('');
  }
}
