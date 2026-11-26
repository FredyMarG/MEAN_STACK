/**
 * ============================================================================
 * COMPONENTE TRACKER DE HÁBITOS (src/app/pages/habitos.component.ts)
 * ============================================================================
 * Propósito: Matriz semanal Lunes–Domingo con cálculo de porcentaje de
 * cumplimiento en tiempo real, creación de hábitos con meta y eliminación (`×`).
 */

import { Component } from '@angular/core';
import { HabitItem, SuiteStorageService } from '../services/suite-storage.service';

@Component({
  selector: 'app-habitos',
  template: `
    <div class="row g-4 text-white">
      <div class="col-lg-8">
        <div class="pn-card p-4">
          <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <h4 class="fw-bold mb-0">🔁 Tracker Semanal de Hábitos</h4>
            <span class="badge rounded-pill px-3 py-2" style="background-color: #a56ef3;">
              Progreso semanal: {{ checksTotales }}/{{ posiblesTotales }} ({{ porcentaje }}%)
            </span>
          </div>

          <div class="table-responsive">
            <table class="table table-dark table-bordered align-middle text-center mb-0">
              <thead>
                <tr>
                  <th class="text-start">Hábito</th>
                  <th *ngFor="let d of dias">{{ d }}</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let h of habitos">
                  <td class="text-start">
                    <div class="d-flex justify-content-between align-items-center gap-2">
                      <div>
                        <div class="fw-semibold">⭐ {{ h.name }}</div>
                        <small class="text-secondary">{{ h.meta }}</small>
                      </div>
                      <button type="button" class="btn btn-sm btn-outline-danger" title="Eliminar hábito"
                        (click)="eliminar(h.id)">×</button>
                    </div>
                  </td>
                  <td *ngFor="let checked of h.days; let dIdx = index"
                    style="cursor: pointer;" (click)="toggleDia(h.id, dIdx)">
                    <span *ngIf="checked" class="fw-bold fs-5" style="color: #00E096;">✓</span>
                    <span *ngIf="!checked" class="text-secondary">·</span>
                  </td>
                </tr>
                <tr *ngIf="habitos.length === 0">
                  <td colspan="8" class="text-secondary py-4">No tienes hábitos registrados.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Formulario Nuevo Hábito -->
      <div class="col-lg-4">
        <div class="pn-card p-4">
          <h5 class="fw-bold mb-3">➕ Define tu Hábito</h5>
          <form class="d-flex flex-column gap-2" (submit)="$event.preventDefault(); agregar()">
            <input type="text" class="form-control bg-dark text-white border-secondary"
              [(ngModel)]="nombre" name="nombre" placeholder="Nombre del hábito *" required />
            <div class="row g-2">
              <div class="col-6">
                <select class="form-select bg-dark text-white border-secondary" [(ngModel)]="condicion" name="condicion">
                  <option value="Al menos">Al menos</option>
                  <option value="Menos de">Menos de</option>
                  <option value="Exactamente">Exactamente</option>
                </select>
              </div>
              <div class="col-6">
                <input type="text" class="form-control bg-dark text-white border-secondary"
                  [(ngModel)]="cantidad" name="cantidad" placeholder="Ej. 30 min / 8 vasos" />
              </div>
            </div>
            <textarea rows="3" class="form-control bg-dark text-white border-secondary"
              [(ngModel)]="descripcion" name="descripcion" placeholder="Descripción (opcional)"></textarea>
            <button type="submit" class="btn btn-info text-dark fw-bold mt-2">+ Agregar Hábito</button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class HabitosComponent {
  habitos: HabitItem[] = this.storage.getHabits();
  dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  nombre = '';
  condicion = 'Al menos';
  cantidad = '';
  descripcion = '';

  constructor(private storage: SuiteStorageService) {}

  /** Total de días marcados como cumplidos en toda la matriz semanal. */
  get checksTotales(): number {
    return this.habitos.reduce((acc, h) => acc + h.days.filter(Boolean).length, 0);
  }

  /** Total de casillas posibles (`hábitos * 7 días`). */
  get posiblesTotales(): number {
    return this.habitos.length * 7;
  }

  /** Porcentaje semanal de cumplimiento redondeado al entero más cercano. */
  get porcentaje(): number {
    return this.posiblesTotales > 0 ? Math.round((this.checksTotales / this.posiblesTotales) * 100) : 0;
  }

  /** Alterna el cumplimiento de un día específico (`0 = Lun` .. `6 = Dom`). */
  toggleDia(id: number, dayIdx: number): void {
    this.habitos = this.habitos.map((h) => {
      if (h.id !== id) return h;
      const days = [...h.days];
      days[dayIdx] = !days[dayIdx];
      return { ...h, days };
    });
    this.storage.saveHabits(this.habitos);
  }

  /** Crea un nuevo hábito semanal con su meta y lo guarda en `localStorage`. */
  agregar(): void {
    const clean = this.nombre.trim();
    if (!clean) return;
    const meta = [`${this.condicion} ${this.cantidad}`.trim(), this.descripcion.trim()].filter(Boolean).join(' — ');
    this.habitos = [
      ...this.habitos,
      { id: Date.now(), name: clean, meta: meta || clean, days: [true, false, false, false, false, false, false] }
    ];
    this.nombre = '';
    this.cantidad = '';
    this.descripcion = '';
    this.storage.saveHabits(this.habitos);
  }

  /** Elimina un hábito por su identificador único. */
  eliminar(id: number): void {
    this.habitos = this.habitos.filter((h) => h.id !== id);
    this.storage.saveHabits(this.habitos);
  }
}
