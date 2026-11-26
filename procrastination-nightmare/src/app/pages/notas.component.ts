/**
 * ============================================================================
 * COMPONENTE NOTAS RÁPIDAS (src/app/pages/notas.component.ts)
 * ============================================================================
 * Propósito: Crear, buscar, fijar/desfijar y eliminar notas rápidas con
 * etiquetas de color persistidas en `localStorage`.
 */

import { Component } from '@angular/core';
import { NoteItem, SuiteStorageService } from '../services/suite-storage.service';

@Component({
  selector: 'app-notas',
  template: `
    <div class="pn-card p-4 text-white">
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 class="fw-bold mb-0">📝 Notas Rápidas &amp; Ideas</h2>
          <small class="text-secondary">Fija tus ideas importantes y guárdalas en localStorage</small>
        </div>
        <span class="badge bg-info text-dark fs-6">{{ notasFiltradas.length }} notas</span>
      </div>

      <div class="row g-4">
        <div class="col-lg-4">
          <form class="p-3 rounded-3 bg-dark border border-secondary d-flex flex-column gap-2"
            (submit)="$event.preventDefault(); agregar()">
            <input type="text" class="form-control bg-secondary bg-opacity-25 text-white border-secondary"
              [(ngModel)]="titulo" name="titulo" placeholder="Título de la nota *" required />
            <textarea rows="4" class="form-control bg-secondary bg-opacity-25 text-white border-secondary"
              [(ngModel)]="contenido" name="contenido" placeholder="Escribe tu nota o recordatorio..." required></textarea>
            <select class="form-select bg-secondary bg-opacity-25 text-white border-secondary"
              [(ngModel)]="color" name="color">
              <option value="border-info" class="text-dark">Cian (Enfoque)</option>
              <option value="border-warning" class="text-dark">Amarillo (Idea)</option>
              <option value="border-success" class="text-dark">Verde (Completado)</option>
              <option value="border-danger" class="text-dark">Rojo (Urgente)</option>
            </select>
            <button type="submit" class="btn btn-info text-dark fw-bold">+ Guardar Nota</button>
          </form>
        </div>

        <div class="col-lg-8">
          <input type="search" class="form-control bg-dark text-white border-secondary mb-3"
            [(ngModel)]="busqueda" placeholder="🔍 Buscar notas..." />
          <div class="row g-3">
            <div class="col-md-6" *ngFor="let n of notasFiltradas">
              <div class="p-3 rounded-3 bg-dark border h-100 d-flex flex-column" [ngClass]="n.color">
                <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                  <h5 class="fw-bold text-white mb-0">{{ n.title }}</h5>
                  <div class="d-flex gap-1">
                    <button type="button" class="btn btn-sm" [ngClass]="n.pinned ? 'btn-warning' : 'btn-outline-secondary'"
                      (click)="togglePin(n.id)" title="Fijar">📌</button>
                    <button type="button" class="btn btn-sm btn-outline-danger" (click)="eliminar(n.id)" title="Eliminar">×</button>
                  </div>
                </div>
                <p class="text-secondary small flex-grow-1 mb-2" style="white-space: pre-wrap;">{{ n.body }}</p>
                <small class="text-muted">{{ n.createdAt }}</small>
              </div>
            </div>
            <div *ngIf="notasFiltradas.length === 0" class="col-12 text-center text-secondary py-5">
              No hay notas para mostrar.
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NotasComponent {
  notas: NoteItem[] = this.storage.getNotes();
  titulo = '';
  contenido = '';
  color = 'border-info';
  busqueda = '';

  constructor(private storage: SuiteStorageService) {}

  /** Filtra notas por título/contenido y coloca las notas fijadas (`pinned`) primero. */
  get notasFiltradas(): NoteItem[] {
    const q = this.busqueda.trim().toLowerCase();
    return this.notas
      .filter((n) => !q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q))
      .sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }

  /** Crea y guarda una nueva nota rápida al inicio de la lista. */
  agregar(): void {
    if (!this.titulo.trim() || !this.contenido.trim()) return;
    this.notas = [
      {
        id: Date.now(),
        title: this.titulo.trim(),
        body: this.contenido.trim(),
        color: this.color,
        pinned: false,
        createdAt: new Date().toLocaleDateString('es-CO')
      },
      ...this.notas
    ];
    this.titulo = '';
    this.contenido = '';
    this.storage.saveNotes(this.notas);
  }

  /** Fija o desfija una nota para destacarla al principio. */
  togglePin(id: number): void {
    this.notas = this.notas.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n));
    this.storage.saveNotes(this.notas);
  }

  /** Elimina una nota por su ID. */
  eliminar(id: number): void {
    this.notas = this.notas.filter((n) => n.id !== id);
    this.storage.saveNotes(this.notas);
  }
}
