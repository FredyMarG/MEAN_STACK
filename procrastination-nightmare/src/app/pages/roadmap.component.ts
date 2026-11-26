/**
 * ============================================================================
 * COMPONENTE ROADMAP DE TAREAS (src/app/pages/roadmap.component.ts)
 * ============================================================================
 * Propósito: Tablero completo con vista Tabla / Tarjetas, creación, eliminación,
 * filtrado por estado, búsqueda en vivo, ordenamiento por columna, edición de
 * título y cambio de estado persistido en `localStorage`.
 */

import { Component } from '@angular/core';
import { RoadmapState, RoadmapTask, SuiteStorageService } from '../services/suite-storage.service';

@Component({
  selector: 'app-roadmap',
  template: `
    <div class="pn-card p-4 text-white">
      <!-- Barra de Herramientas -->
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div class="d-flex align-items-center gap-2">
          <h3 class="fw-bold mb-0">{{ tituloTabla }}</h3>
          <button type="button" class="btn btn-dark btn-sm border-secondary" (click)="editarTitulo()">✏️ Edit</button>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <button type="button" class="btn btn-dark btn-sm border-secondary" (click)="vistaTarjetas = !vistaTarjetas">
            {{ vistaTarjetas ? 'Vista de Tabla' : 'Vista de Tarjetas' }}
          </button>
          <button type="button" class="btn btn-info btn-sm text-dark fw-bold" (click)="mostrarForm = !mostrarForm">
            + New Task
          </button>
          <button type="button" class="btn btn-sm" [ngClass]="modoBorrar ? 'btn-danger' : 'btn-dark border-secondary'"
            (click)="modoBorrar = !modoBorrar">
            Remove Task
          </button>
        </div>
      </div>

      <!-- Filtros, Búsqueda y Ordenamiento -->
      <div class="row g-2 mb-3">
        <div class="col-md-4">
          <input type="search" class="form-control form-control-sm bg-dark text-white border-secondary"
            [(ngModel)]="busqueda" placeholder="🔍 Buscar tarea, tipo o encargado..." />
        </div>
        <div class="col-md-3">
          <select class="form-select form-select-sm bg-dark text-white border-secondary" [(ngModel)]="filtroEstado">
            <option value="">Todos los estados</option>
            <option *ngFor="let st of estadosDisponibles" [value]="st">{{ st }}</option>
          </select>
        </div>
        <div class="col-md-3">
          <select class="form-select form-select-sm bg-dark text-white border-secondary" [(ngModel)]="criterioOrden">
            <option value="">Orden original</option>
            <option value="name_asc">Tarea (A-Z)</option>
            <option value="name_desc">Tarea (Z-A)</option>
            <option value="state_asc">Estado (A-Z)</option>
            <option value="owner_asc">Encargado (A-Z)</option>
          </select>
        </div>
        <div class="col-md-2 d-grid">
          <button type="button" class="btn btn-outline-secondary btn-sm" (click)="filtroEstado=''; busqueda=''; criterioOrden=''">
            Deshacer Sort
          </button>
        </div>
      </div>

      <!-- Formulario Nueva Tarea -->
      <form *ngIf="mostrarForm" class="p-3 mb-3 rounded-3 bg-dark border border-secondary row g-2"
        (submit)="$event.preventDefault(); agregarTarea()">
        <div class="col-md-3"><input type="text" class="form-control form-control-sm bg-secondary bg-opacity-25 text-white border-secondary" [(ngModel)]="ntName" name="ntName" placeholder="Tarea *" required></div>
        <div class="col-md-2">
          <select class="form-select form-select-sm bg-secondary bg-opacity-25 text-white border-secondary" [(ngModel)]="ntState" name="ntState">
            <option *ngFor="let st of estadosDisponibles" [value]="st" class="text-dark">{{ st }}</option>
          </select>
        </div>
        <div class="col-md-2"><input type="text" class="form-control form-control-sm bg-secondary bg-opacity-25 text-white border-secondary" [(ngModel)]="ntType" name="ntType" placeholder="Tipo *" required></div>
        <div class="col-md-2"><input type="text" class="form-control form-control-sm bg-secondary bg-opacity-25 text-white border-secondary" [(ngModel)]="ntStart" name="ntStart" placeholder="Inicio (ej. 26-Nov-2026)"></div>
        <div class="col-md-2"><input type="text" class="form-control form-control-sm bg-secondary bg-opacity-25 text-white border-secondary" [(ngModel)]="ntOwner" name="ntOwner" placeholder="Encargado *" required></div>
        <div class="col-md-1 d-grid"><button type="submit" class="btn btn-info btn-sm text-dark fw-bold">OK</button></div>
      </form>

      <!-- Vista de Tabla -->
      <div class="table-responsive" *ngIf="!vistaTarjetas">
        <table class="table table-dark table-hover align-middle text-center mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Tarea</th>
              <th>Estado</th>
              <th>Tipo</th>
              <th>Inicio</th>
              <th>Entrega</th>
              <th>Encargado</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of tareasFiltradas; let i = index">
              <td>
                {{ i + 1 }}
                <button *ngIf="modoBorrar" type="button" class="btn btn-sm btn-outline-danger ms-1" (click)="eliminar(t.id)">×</button>
              </td>
              <td>{{ t.name }}</td>
              <td>
                <select class="form-select form-select-sm text-center fw-semibold border-0"
                  [ngClass]="claseEstado(t.state)" [ngModel]="t.state" (ngModelChange)="cambiarEstado(t.id, $event)">
                  <option *ngFor="let st of estadosDisponibles" [value]="st" class="bg-dark text-white">{{ st }}</option>
                </select>
              </td>
              <td>{{ t.typeOfTask }}</td>
              <td>{{ t.startDate }}</td>
              <td>{{ t.endDate }}</td>
              <td>{{ t.inChargeOf }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Vista de Tarjetas -->
      <div class="row g-3" *ngIf="vistaTarjetas">
        <div class="col-md-4" *ngFor="let t of tareasFiltradas">
          <div class="p-3 rounded-3 bg-dark border border-secondary h-100 d-flex flex-column gap-2">
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge bg-info text-dark">{{ t.typeOfTask }}</span>
              <span class="badge" [ngClass]="claseEstado(t.state)">{{ t.state }}</span>
            </div>
            <h5 class="fw-bold mb-0">{{ t.name }}</h5>
            <small class="text-secondary">Inicio: {{ t.startDate }} | Entrega: {{ t.endDate }}</small>
            <div class="d-flex justify-content-between align-items-center mt-auto pt-2 border-top border-secondary">
              <small>Encargado: <strong>{{ t.inChargeOf }}</strong></small>
              <button *ngIf="modoBorrar" type="button" class="btn btn-sm btn-outline-danger" (click)="eliminar(t.id)">×</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RoadmapComponent {
  tareas: RoadmapTask[] = this.storage.getRoadmap();
  tituloTabla = this.storage.getRoadmapTitle();
  vistaTarjetas = false;
  mostrarForm = false;
  modoBorrar = false;

  busqueda = '';
  filtroEstado = '';
  criterioOrden = '';

  ntName = '';
  ntState: RoadmapState = 'No Iniciado';
  ntType = '';
  ntStart = '';
  ntOwner = '';

  estadosDisponibles: RoadmapState[] = ['Completado', 'En Progreso', 'Con Demora', 'Aplazado', 'Cancelado', 'No Iniciado'];

  constructor(private storage: SuiteStorageService) {}

  /** Filtra por estado/texto y aplica el criterio de ordenamiento elegido. */
  get tareasFiltradas(): RoadmapTask[] {
    const q = this.busqueda.trim().toLowerCase();
    const list = this.tareas.filter((t) => {
      const matchSt = !this.filtroEstado || t.state === this.filtroEstado;
      const matchQ = !q || t.name.toLowerCase().includes(q) || t.typeOfTask.toLowerCase().includes(q) || t.inChargeOf.toLowerCase().includes(q);
      return matchSt && matchQ;
    });

    switch (this.criterioOrden) {
      case 'name_asc': return [...list].sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc': return [...list].sort((a, b) => b.name.localeCompare(a.name));
      case 'state_asc': return [...list].sort((a, b) => a.state.localeCompare(b.state));
      case 'owner_asc': return [...list].sort((a, b) => a.inChargeOf.localeCompare(b.inChargeOf));
      default: return list;
    }
  }

  /** Retorna la clase Bootstrap de color correspondiente al estado de la tarea. */
  claseEstado(state: RoadmapState): string {
    const map: Record<RoadmapState, string> = {
      'Completado': 'bg-success text-white',
      'En Progreso': 'bg-primary text-white',
      'Con Demora': 'bg-warning text-dark',
      'Aplazado': 'bg-light text-dark',
      'Cancelado': 'bg-danger text-white',
      'No Iniciado': 'bg-secondary text-white'
    };
    return map[state] || 'bg-secondary text-white';
  }

  cambiarEstado(id: number, nuevoEstado: RoadmapState): void {
    this.tareas = this.tareas.map((t) => (t.id === id ? { ...t, state: nuevoEstado } : t));
    this.storage.saveRoadmap(this.tareas);
  }

  agregarTarea(): void {
    if (!this.ntName.trim() || !this.ntType.trim() || !this.ntOwner.trim()) return;
    this.tareas = [
      ...this.tareas,
      {
        id: Date.now(),
        name: this.ntName.trim(),
        state: this.ntState,
        typeOfTask: this.ntType.trim(),
        startDate: this.ntStart.trim() || 'N/A',
        endDate: 'N/A',
        inChargeOf: this.ntOwner.trim()
      }
    ];
    this.ntName = '';
    this.ntType = '';
    this.ntStart = '';
    this.ntOwner = '';
    this.mostrarForm = false;
    this.storage.saveRoadmap(this.tareas);
  }

  eliminar(id: number): void {
    this.tareas = this.tareas.filter((t) => t.id !== id);
    this.storage.saveRoadmap(this.tareas);
  }

  editarTitulo(): void {
    const nuevo = window.prompt('Nuevo nombre para el Roadmap:', this.tituloTabla);
    if (nuevo && nuevo.trim()) {
      this.tituloTabla = nuevo.trim();
      this.storage.saveRoadmapTitle(this.tituloTabla);
    }
  }
}
