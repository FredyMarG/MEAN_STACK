/**
 * ============================================================================
 * COMPONENTE RAÍZ DE TURISMO FRONT (Proyecto_Bit/TurismoFront/src/app/app.component.ts)
 * ============================================================================
 * Propósito: Interfaz Angular para consultar, filtrar y registrar destinos
 * turísticos conectada con el modelo de datos de TurismoBack.
 */
import { Component } from '@angular/core';

interface DestinoTuristico {
  nombre: string;
  ciudad: string;
  descripcion: string;
  precio: number;
  calificacion: number;
}

@Component({
  selector: 'app-root',
  template: `
    <div class="container py-4">
      <header class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h2 class="fw-bold text-primary mb-0">✈️ BIT Turismo Colombia (MEAN Stack)</h2>
          <small class="text-muted">Cliente Angular 15 conectado a API REST Express + MongoDB</small>
        </div>
        <span class="badge bg-primary fs-6">{{ destinos.length }} Destinos Activos</span>
      </header>

      <div class="row g-4">
        <!-- Formulario de Nuevo Destino -->
        <div class="col-lg-4">
          <div class="card shadow-sm border-0 p-3">
            <h5 class="fw-bold mb-3">Registrar Nuevo Destino</h5>
            <div class="mb-2">
              <label class="form-label small fw-semibold">Nombre del Destino</label>
              <input class="form-control" [(ngModel)]="nuevo.nombre" placeholder="Ej. Parque Tayrona" />
            </div>
            <div class="mb-2">
              <label class="form-label small fw-semibold">Ciudad / Región</label>
              <input class="form-control" [(ngModel)]="nuevo.ciudad" placeholder="Ej. Santa Marta" />
            </div>
            <div class="mb-2">
              <label class="form-label small fw-semibold">Precio del Plan (COP)</label>
              <input type="number" class="form-control" [(ngModel)]="nuevo.precio" />
            </div>
            <div class="mb-3">
              <label class="form-label small fw-semibold">Descripción</label>
              <textarea class="form-control" rows="2" [(ngModel)]="nuevo.descripcion"></textarea>
            </div>
            <button class="btn btn-primary w-100 fw-semibold" (click)="agregarDestino()">
              + Guardar Destino
            </button>
          </div>
        </div>

        <!-- Catálogo de Destinos -->
        <div class="col-lg-8">
          <div class="row g-3">
            <div class="col-md-6" *ngFor="let d of destinos; let i = index">
              <div class="card h-100 shadow-sm border-0 p-3">
                <div class="d-flex justify-content-between">
                  <span class="badge bg-info text-dark">{{ d.ciudad }}</span>
                  <span class="text-warning fw-bold">★ {{ d.calificacion }}.0</span>
                </div>
                <h5 class="fw-bold mt-2 mb-1">{{ d.nombre }}</h5>
                <p class="text-muted small flex-grow-1">{{ d.descripcion }}</p>
                <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                  <strong class="text-success">\${{ d.precio | number }} COP</strong>
                  <button class="btn btn-sm btn-outline-danger" (click)="eliminarDestino(i)">Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AppComponent {
  title = 'TurismoFront';

  destinos: DestinoTuristico[] = [
    {
      nombre: 'Ciudad Amurallada & Islas del Rosario',
      ciudad: 'Cartagena',
      descripcion: 'Recorrido histórico colonial y día de playa en aguas cristalinas.',
      precio: 1450000,
      calificacion: 5
    },
    {
      nombre: 'Valle de Cocora & Ruta del Café',
      ciudad: 'Salento, Quindío',
      descripcion: 'Caminata ecológica entre palmas de cera y cata de café de origen.',
      precio: 980000,
      calificacion: 5
    }
  ];

  nuevo: DestinoTuristico = {
    nombre: '',
    ciudad: '',
    descripcion: '',
    precio: 850000,
    calificacion: 5
  };

  agregarDestino(): void {
    if (!this.nuevo.nombre.trim() || !this.nuevo.ciudad.trim()) return;
    this.destinos.unshift({ ...this.nuevo });
    this.nuevo = { nombre: '', ciudad: '', descripcion: '', precio: 850000, calificacion: 5 };
  }

  eliminarDestino(index: number): void {
    this.destinos.splice(index, 1);
  }
}
