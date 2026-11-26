/**
 * ============================================================================
 * COMPONENTE LISTA DE TAREAS (src/app/pages/tareas.component.ts)
 * ============================================================================
 * Propósito: Gestor de tareas rápidas con persistencia en `localStorage`,
 * contador de pendientes, marcado de completado y limpieza en un clic.
 */

import { Component } from '@angular/core';
import { SuiteStorageService, TodoItem } from '../services/suite-storage.service';

@Component({
  selector: 'app-tareas',
  template: `
    <div class="pn-card p-4 mx-auto text-white" style="max-width: 580px;">
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h3 class="fw-bold mb-0">✅ Lista de Tareas</h3>
        <div class="d-flex align-items-center gap-2">
          <span class="badge bg-info text-dark fs-6">{{ pendientes }} {{ pendientes === 1 ? 'pendiente' : 'pendientes' }}</span>
          <button type="button" class="btn btn-outline-secondary btn-sm" (click)="limpiarCompletadas()">Limpiar completadas</button>
        </div>
      </div>

      <form class="d-flex gap-2 mb-3" (submit)="$event.preventDefault(); agregar()">
        <input type="text" class="form-control bg-dark text-white border-secondary"
          [(ngModel)]="nuevaTarea" name="nuevaTarea" placeholder="Agregar nueva tarea..." />
        <button type="submit" class="btn btn-info text-dark fw-bold px-4">+</button>
      </form>

      <div *ngIf="errorVacio" class="alert alert-danger py-2 small">Ingrese una tarea antes de agregar.</div>

      <ul class="list-unstyled mb-0">
        <li *ngFor="let t of tareas"
          class="d-flex align-items-center justify-content-between p-2 px-3 mb-2 rounded-3 bg-dark border border-secondary">
          <label class="d-flex align-items-center gap-2 mb-0 flex-grow-1" style="cursor: pointer;">
            <input type="checkbox" class="form-check-input mt-0" [checked]="t.done" (change)="toggle(t.id)" />
            <span [class.text-decoration-line-through]="t.done" [class.text-secondary]="t.done">{{ t.text }}</span>
          </label>
          <button type="button" class="btn btn-sm btn-outline-danger ms-2" (click)="eliminar(t.id)">X</button>
        </li>
      </ul>

      <div *ngIf="tareas.length === 0" class="text-center text-secondary py-3">
        No hay tareas pendientes.
      </div>
    </div>
  `
})
export class TareasComponent {
  tareas: TodoItem[] = this.storage.getTodos();
  nuevaTarea = '';
  errorVacio = false;

  constructor(private storage: SuiteStorageService) {}

  /** Calcula el número de tareas aún no completadas. */
  get pendientes(): number {
    return this.tareas.filter((t) => !t.done).length;
  }

  /** Valida la entrada y agrega una nueva tarea persistida en `localStorage`. */
  agregar(): void {
    const text = this.nuevaTarea.trim();
    if (!text) {
      this.errorVacio = true;
      return;
    }
    this.errorVacio = false;
    this.tareas = [...this.tareas, { id: Date.now(), text, done: false }];
    this.nuevaTarea = '';
    this.storage.saveTodos(this.tareas);
  }

  /** Alterna el estado completado de la tarea seleccionada. */
  toggle(id: number): void {
    this.tareas = this.tareas.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    this.storage.saveTodos(this.tareas);
  }

  /** Elimina una tarea por su identificador único. */
  eliminar(id: number): void {
    this.tareas = this.tareas.filter((t) => t.id !== id);
    this.storage.saveTodos(this.tareas);
  }

  /** Remueve todas las tareas marcadas como completadas. */
  limpiarCompletadas(): void {
    this.tareas = this.tareas.filter((t) => !t.done);
    this.storage.saveTodos(this.tareas);
  }
}
