/**
 * ============================================================================
 * COMPONENTE CALENDARIO DE EVENTOS (src/app/pages/calendario.component.ts)
 * ============================================================================
 * Propósito: Calendario mensual con creación de eventos, filtrado por color,
 * cancelación/eliminación (`×`) sincronizada y subtareas por evento.
 */

import { Component } from '@angular/core';
import { CalendarEvent, SuiteStorageService } from '../services/suite-storage.service';

@Component({
  selector: 'app-calendario',
  template: `
    <div class="row g-4 text-white">
      <!-- Panel Lateral: Lista de Eventos + Subtareas -->
      <div class="col-lg-4 d-flex flex-column gap-4">
        <div class="pn-card p-3">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0">📅 Eventos</h5>
            <button type="button" class="btn btn-info btn-sm text-dark fw-bold rounded-pill px-3"
              (click)="mostrarForm = !mostrarForm">
              {{ mostrarForm ? 'Cerrar' : '+ Nuevo' }}
            </button>
          </div>

          <!-- Formulario inline para nuevo evento -->
          <form *ngIf="mostrarForm" class="p-3 mb-3 rounded-3 bg-dark border border-secondary d-flex flex-column gap-2"
            (submit)="$event.preventDefault(); agregarEvento()">
            <input type="text" class="form-control form-control-sm bg-secondary bg-opacity-25 text-white border-secondary"
              [(ngModel)]="nuevoTitulo" name="nuevoTitulo" placeholder="Título del evento *" required />
            <div class="row g-2">
              <div class="col-6">
                <input type="number" min="1" max="31" class="form-control form-control-sm bg-secondary bg-opacity-25 text-white border-secondary"
                  [(ngModel)]="nuevoDia" name="nuevoDia" placeholder="Día (1-31)" />
              </div>
              <div class="col-6">
                <select class="form-select form-select-sm bg-secondary bg-opacity-25 text-white border-secondary"
                  [(ngModel)]="nuevoColor" name="nuevoColor">
                  <option value="bg-primary" class="text-dark">Azul</option>
                  <option value="bg-info text-dark" class="text-dark">Cian</option>
                  <option value="bg-success" class="text-dark">Verde</option>
                  <option value="bg-warning text-dark" class="text-dark">Amarillo</option>
                  <option value="bg-danger" class="text-dark">Rojo</option>
                </select>
              </div>
            </div>
            <input type="text" class="form-control form-control-sm bg-secondary bg-opacity-25 text-white border-secondary"
              [(ngModel)]="nuevaDesc" name="nuevaDesc" placeholder="Descripción..." />
            <button type="submit" class="btn btn-primary btn-sm fw-semibold">Guardar Evento</button>
          </form>

          <!-- Filtro rápido por color -->
          <div class="d-flex flex-wrap gap-1 mb-3">
            <button type="button" class="btn btn-sm rounded-pill"
              [ngClass]="filtroColor === '' ? 'btn-light text-dark' : 'btn-outline-secondary'"
              (click)="filtroColor = ''">Todos</button>
            <button type="button" *ngFor="let c of colores"
              class="btn btn-sm rounded-circle p-2 border" [ngClass]="c.cls"
              [title]="c.label" (click)="filtroColor = filtroColor === c.cls ? '' : c.cls"></button>
          </div>

          <!-- Lista de eventos con botón cancelar -->
          <div class="d-flex flex-column gap-2" style="max-height: 260px; overflow-y: auto;">
            <div *ngFor="let ev of eventosFiltrados"
              class="p-2 px-3 rounded-3 d-flex align-items-center justify-content-between gap-2"
              [ngClass]="ev.colorClass" style="cursor: pointer;" (click)="eventoActivoId = ev.id">
              <div>
                <div class="small fw-bold">{{ ev.timeLabel }}</div>
                <div>{{ ev.title }}</div>
              </div>
              <button type="button" class="btn btn-sm btn-outline-light" title="Cancelar evento"
                (click)="$event.stopPropagation(); cancelarEvento(ev.id)">×</button>
            </div>
            <div *ngIf="eventosFiltrados.length === 0" class="text-secondary small text-center py-3">
              No hay eventos en esta categoría.
            </div>
          </div>
        </div>

        <!-- Subtareas del evento seleccionado -->
        <div class="pn-card p-3" *ngIf="eventoActivo">
          <h6 class="fw-bold mb-2">📋 Subtareas: {{ eventoActivo.title }}</h6>
          <div *ngFor="let sub of eventoActivo.subtasks" class="form-check mb-1">
            <input type="checkbox" class="form-check-input" [checked]="sub.done"
              (change)="toggleSubtask(eventoActivo.id, sub)" />
            <label class="form-check-label small" [class.text-decoration-line-through]="sub.done"
              [class.text-secondary]="sub.done">{{ sub.text }}</label>
          </div>
        </div>
      </div>

      <!-- Grilla Mensual -->
      <div class="col-lg-8">
        <div class="pn-card p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="fw-bold mb-0">Calendario de Eventos (Mes)</h4>
            <span class="badge bg-info text-dark">{{ eventos.length }} eventos activos</span>
          </div>
          <div class="row row-cols-7 g-2 text-center small text-secondary fw-bold mb-2">
            <div class="col" *ngFor="let d of diasSemana">{{ d }}</div>
          </div>
          <div class="row row-cols-7 g-2">
            <div class="col" *ngFor="let day of diasMes">
              <div class="p-2 rounded-3 bg-dark border border-secondary" style="min-height: 82px;">
                <div class="small text-secondary fw-bold mb-1">{{ day }}</div>
                <ng-container *ngFor="let ev of eventosDelDia(day)">
                  <div class="badge w-100 text-truncate mb-1 d-flex justify-content-between align-items-center"
                    [ngClass]="ev.colorClass" [title]="ev.description">
                    <span class="text-truncate">{{ ev.title }}</span>
                    <span style="cursor:pointer;" (click)="cancelarEvento(ev.id)">×</span>
                  </div>
                </ng-container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .row-cols-7 > * { flex: 0 0 auto; width: 14.2857%; }
    @media (max-width: 768px) { .row-cols-7 > * { width: 33.3333%; } }
  `]
})
export class CalendarioComponent {
  eventos: CalendarEvent[] = this.storage.getEvents();
  eventoActivoId: number | null = this.eventos[0]?.id ?? null;
  mostrarForm = false;
  filtroColor = '';

  nuevoTitulo = '';
  nuevoDia = 15;
  nuevoColor = 'bg-primary';
  nuevaDesc = '';

  diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  diasMes = Array.from({ length: 28 }, (_, i) => String(i + 1).padStart(2, '0'));
  colores = [
    { cls: 'bg-primary', label: 'Azul' },
    { cls: 'bg-info text-dark', label: 'Cian' },
    { cls: 'bg-success', label: 'Verde' },
    { cls: 'bg-warning text-dark', label: 'Amarillo' },
    { cls: 'bg-danger', label: 'Rojo' }
  ];

  constructor(private storage: SuiteStorageService) {}

  /** Lista filtrada por el color de categoría seleccionado. */
  get eventosFiltrados(): CalendarEvent[] {
    if (!this.filtroColor) return this.eventos;
    return this.eventos.filter((e) => e.colorClass === this.filtroColor);
  }

  /** Evento actualmente seleccionado para mostrar sus subtareas. */
  get eventoActivo(): CalendarEvent | undefined {
    return this.eventos.find((e) => e.id === this.eventoActivoId) || this.eventos[0];
  }

  /** Retorna los eventos programados para un día específico (`01`..`28`). */
  eventosDelDia(day: string): CalendarEvent[] {
    return this.eventosFiltrados.filter((e) => e.day === day);
  }

  /** Crea un nuevo evento con subtareas por defecto y lo persiste en `localStorage`. */
  agregarEvento(): void {
    const title = this.nuevoTitulo.trim();
    if (!title) return;
    const day = String(Math.max(1, Math.min(28, Number(this.nuevoDia) || 15))).padStart(2, '0');
    const nuevo: CalendarEvent = {
      id: Date.now(),
      title,
      day,
      timeLabel: `${day} Mar - 10 : 00 AM`,
      colorClass: this.nuevoColor,
      description: this.nuevaDesc.trim() || 'Evento programado desde el calendario.',
      subtasks: [
        { text: this.nuevaDesc.trim() || `Preparar "${title}"`, done: false },
        { text: 'Confirmar cumplimiento', done: false }
      ]
    };
    this.eventos = [nuevo, ...this.eventos];
    this.eventoActivoId = nuevo.id;
    this.nuevoTitulo = '';
    this.nuevaDesc = '';
    this.mostrarForm = false;
    this.storage.saveEvents(this.eventos);
  }

  /** Cancela y elimina el evento tanto de la lista lateral como de la grilla mensual. */
  cancelarEvento(id: number): void {
    this.eventos = this.eventos.filter((e) => e.id !== id);
    if (this.eventoActivoId === id) {
      this.eventoActivoId = this.eventos[0]?.id ?? null;
    }
    this.storage.saveEvents(this.eventos);
  }

  /** Marca o desmarca una subtarea del evento activo y guarda el estado. */
  toggleSubtask(_eventId: number, sub: { text: string; done: boolean }): void {
    sub.done = !sub.done;
    this.storage.saveEvents(this.eventos);
  }
}
