/**
 * ============================================================================
 * COMPONENTE INICIO / DASHBOARD (src/app/pages/inicio.component.ts)
 * ============================================================================
 * Propósito: Panel principal de Procrastination Nightmare con métricas en vivo
 * desde `SuiteStorageService`, accesos rápidos a los módulos y respaldo JSON.
 */

import { Component } from '@angular/core';
import { SuiteStorageService } from '../services/suite-storage.service';

@Component({
  selector: 'app-inicio',
  template: `
    <div class="pn-card p-4 text-white">
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary gap-2">
        <div>
          <span class="badge bg-info text-dark mb-1">Suite Angular 16</span>
          <h2 class="fw-bold mb-0">Procrastination Nightmare — Panel Principal</h2>
          <small class="text-secondary">Resumen en tiempo real sincronizado con localStorage</small>
        </div>
        <a routerLink="/pomodoro" class="btn btn-info text-dark fw-bold rounded-pill px-4">▶ Iniciar Pomodoro</a>
      </div>

      <!-- Métricas en vivo -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
          <div class="p-3 rounded-3 bg-dark border border-secondary text-center">
            <div class="fs-2 fw-bold text-info">{{ storage.getPomodoros() }}</div>
            <div class="small text-secondary">Pomodoros</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="p-3 rounded-3 bg-dark border border-secondary text-center">
            <div class="fs-2 fw-bold text-warning">{{ pendientesCount }}</div>
            <div class="small text-secondary">Tareas Pendientes</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="p-3 rounded-3 bg-dark border border-secondary text-center">
            <div class="fs-2 fw-bold text-success">{{ storage.getHabits().length }}</div>
            <div class="small text-secondary">Hábitos Activos</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="p-3 rounded-3 bg-dark border border-secondary text-center">
            <div class="fs-2 fw-bold text-primary">{{ storage.getRoadmap().length }}</div>
            <div class="small text-secondary">Tareas Roadmap</div>
          </div>
        </div>
      </div>

      <!-- Accesos rápidos a todos los módulos -->
      <div class="row g-3">
        <div class="col-md-4" *ngFor="let card of modulos">
          <a [routerLink]="card.route" class="text-decoration-none">
            <div class="p-3 rounded-3 bg-dark border border-secondary h-100 text-white">
              <h5 class="fw-bold" [ngClass]="card.color">{{ card.title }}</h5>
              <p class="small text-secondary mb-0">{{ card.desc }}</p>
            </div>
          </a>
        </div>
      </div>

      <!-- Respaldo JSON -->
      <div class="mt-4 pt-3 border-top border-secondary d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <strong class="small text-light">💾 Respaldo de Datos Locales</strong>
          <div class="small" [ngClass]="backupError ? 'text-danger' : 'text-info'">
            {{ backupStatus || 'Exporta o restaura todo tu progreso en un archivo .json' }}
          </div>
        </div>
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-outline-info btn-sm rounded-pill px-3" (click)="exportar()">⬇ Exportar JSON</button>
          <label class="btn btn-outline-light btn-sm rounded-pill px-3 mb-0" style="cursor:pointer;">
            ⬆ Importar JSON
            <input type="file" accept="application/json,.json" class="d-none" (change)="importar($event)">
          </label>
        </div>
      </div>
    </div>
  `
})
export class InicioComponent {
  /** Mensaje de estado tras exportar o importar respaldo JSON. */
  backupStatus = '';
  /** Indica si la última operación de respaldo produjo un error. */
  backupError = false;

  /** Catálogo de tarjetas de acceso rápido mostradas en el Dashboard. */
  modulos = [
    { route: '/pomodoro', title: '⏱️ Temporizador Pomodoro', color: 'text-info', desc: 'Ciclos de 25 min de enfoque y 5 min de descanso con alarma.' },
    { route: '/tareas', title: '✅ Lista de Tareas', color: 'text-warning', desc: 'Captura rápida de pendientes con tachado y persistencia local.' },
    { route: '/notas', title: '📝 Notas Rápidas', color: 'text-info', desc: 'Guarda y fija ideas o recordatorios con etiquetas de color.' },
    { route: '/calendario', title: '📅 Calendario de Eventos', color: 'text-primary', desc: 'Crea, filtra y cancela eventos con subtareas por evento.' },
    { route: '/habitos', title: '🔁 Tracker de Hábitos', color: 'text-success', desc: 'Seguimiento semanal Lunes–Domingo con porcentaje de avance.' },
    { route: '/roadmap', title: '📊 Roadmap de Tareas', color: 'text-light', desc: 'Tabla/tarjetas con filtros, búsqueda y cambio de estado.' },
    { route: '/landing', title: '🌐 Landing Page', color: 'text-secondary', desc: 'Página promocional e ilustraciones del proyecto.' }
  ];

  constructor(public storage: SuiteStorageService) {}

  /** Cantidad de tareas pendientes (no completadas) en la Lista de Tareas. */
  get pendientesCount(): number {
    return this.storage.getTodos().filter((t) => !t.done).length;
  }

  /** Genera y descarga un archivo `.json` con todas las claves de la suite. */
  exportar(): void {
    const blob = new Blob([this.storage.exportBackup()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `procrastination-nightmare-angular-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.backupError = false;
    this.backupStatus = '✅ Respaldo JSON descargado correctamente.';
  }

  /** Lee un archivo `.json` seleccionado por el usuario y restaura el estado en `localStorage`. */
  importar(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const count = this.storage.importBackup(String(reader.result || '{}'));
        this.backupError = false;
        this.backupStatus = `✅ Respaldo restaurado (${count} módulos actualizados).`;
      } catch (err: unknown) {
        this.backupError = true;
        this.backupStatus = `✖ Error al importar: ${(err as Error).message}`;
      } finally {
        input.value = '';
      }
    };
    reader.readAsText(file);
  }
}
