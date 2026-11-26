/**
 * ============================================================================
 * COMPONENTE RAÍZ — TURISMO MEAN (Turismo_MEAN/TurismoFront/src/app/app.component.ts)
 * ============================================================================
 * Propósito: Interfaz principal en Angular 16 para gestionar destinos turísticos
 * conectada a `TurismoBack` (Express + MongoDB/JSON) con:
 * - CRUD completo y confirmación inline antes de eliminar.
 * - Buscador en tiempo real, píldoras de filtro por ciudad y ordenamiento.
 * - Optimización de renderizado `*ngFor` mediante `trackByDestino`.
 * - Panel de métricas en vivo y respaldo automático offline en `localStorage`.
 */
import { Component, OnInit } from '@angular/core';
import { DestinoService, DestinoTuristico } from './services/destino.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="container py-4">
      <!-- Cabecera principal -->
      <header class="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom gap-2">
        <div>
          <h2 class="fw-bold text-primary mb-0">✈️ Turismo MEAN — Destinos de Colombia</h2>
          <small class="text-muted">Plataforma Full-Stack Angular 16 + Express + MongoDB / JSON</small>
        </div>
        <div class="d-flex align-items-center gap-2">
          <span class="badge" [ngClass]="destinoService.modoOffline ? 'bg-warning text-dark' : 'bg-success'">
            {{ destinoService.modoOffline ? 'Modo Offline (localStorage)' : 'API Conectada (puerto 4000)' }}
          </span>
          <span class="badge bg-primary fs-6">{{ destinosFiltrados.length }} Destinos</span>
        </div>
      </header>

      <!-- Métricas resumidas del catálogo -->
      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <div class="card border-0 shadow-sm p-3">
            <small class="text-muted">Total Destinos</small>
            <h4 class="fw-bold mb-0 text-primary">{{ destinosFiltrados.length }}</h4>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm p-3">
            <small class="text-muted">Precio Promedio</small>
            <h4 class="fw-bold mb-0 text-success">\${{ precioPromedio | number }} COP</h4>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm p-3">
            <small class="text-muted">Calificación Promedio</small>
            <h4 class="fw-bold mb-0 text-warning">★ {{ calificacionPromedio }}</h4>
          </div>
        </div>
      </div>

      <!-- Notificación de acción -->
      <div *ngIf="mensajeExito" class="alert alert-success alert-dismissible fade show py-2 small mb-3">
        {{ mensajeExito }}
        <button type="button" class="btn-close btn-sm" (click)="mensajeExito = ''" aria-label="Cerrar"></button>
      </div>

      <div class="row g-4">
        <!-- Formulario Crear / Editar Destino -->
        <div class="col-lg-4">
          <div class="card shadow-sm border-0 p-3">
            <h5 class="fw-bold mb-3">
              {{ editandoId ? '✏️ Editar Destino' : '➕ Registrar Nuevo Destino' }}
            </h5>
            <div class="mb-2">
              <label for="destNombre" class="form-label small fw-semibold">Nombre del Destino *</label>
              <input id="destNombre" class="form-control" [(ngModel)]="formulario.nombre" placeholder="Ej. Parque Tayrona" />
            </div>
            <div class="mb-2">
              <label for="destCiudad" class="form-label small fw-semibold">Ciudad / Región *</label>
              <input id="destCiudad" class="form-control" [(ngModel)]="formulario.ciudad" placeholder="Ej. Santa Marta" />
            </div>
            <div class="row g-2 mb-2">
              <div class="col-7">
                <label for="destPrecio" class="form-label small fw-semibold">Precio (COP) *</label>
                <input id="destPrecio" type="number" min="0" class="form-control" [(ngModel)]="formulario.precio" />
              </div>
              <div class="col-5">
                <label for="destCalif" class="form-label small fw-semibold">Estrellas (1-5)</label>
                <input id="destCalif" type="number" min="1" max="5" step="0.1" class="form-control" [(ngModel)]="formulario.calificacion" />
              </div>
            </div>
            <div class="mb-3">
              <label for="destDesc" class="form-label small fw-semibold">Descripción</label>
              <textarea id="destDesc" class="form-control" rows="2" [(ngModel)]="formulario.descripcion" placeholder="Describe la experiencia..."></textarea>
            </div>
            <div *ngIf="mensajeError" class="alert alert-danger py-2 small mb-2">{{ mensajeError }}</div>
            <div class="d-grid gap-2">
              <button class="btn btn-primary fw-semibold" (click)="guardarDestino()" [disabled]="cargando">
                {{ editandoId ? 'Actualizar Destino' : '+ Guardar Destino' }}
              </button>
              <button *ngIf="editandoId" class="btn btn-outline-secondary btn-sm" (click)="cancelarEdicion()">
                Cancelar edición
              </button>
            </div>
          </div>
        </div>

        <!-- Catálogo, Buscador, Píldoras de Ciudad y Ordenamiento -->
        <div class="col-lg-8">
          <div class="row g-2 mb-2">
            <div class="col-md-7">
              <div class="input-group shadow-sm">
                <span class="input-group-text bg-white border-0">🔍</span>
                <input
                  type="search"
                  class="form-control border-0"
                  [(ngModel)]="filtro"
                  placeholder="Buscar destino por nombre o ciudad..."
                  aria-label="Buscar destino"
                />
              </div>
            </div>
            <div class="col-md-3">
              <select class="form-select shadow-sm border-0" [(ngModel)]="orden" aria-label="Ordenar destinos">
                <option value="recientes">Más recientes</option>
                <option value="precio_asc">Menor precio</option>
                <option value="precio_desc">Mayor precio</option>
                <option value="calificacion">Mejor calificación</option>
              </select>
            </div>
            <div class="col-md-2 d-grid">
              <button class="btn btn-outline-primary shadow-sm" (click)="cargarDestinos()">Recargar</button>
            </div>
          </div>

          <!-- Píldoras de filtro rápido por ciudad -->
          <div class="d-flex flex-wrap gap-1 mb-3" *ngIf="ciudadesDisponibles.length > 0">
            <button
              type="button"
              class="btn btn-sm rounded-pill"
              [ngClass]="ciudadFiltro === '' ? 'btn-primary' : 'btn-outline-secondary'"
              (click)="ciudadFiltro = ''"
            >
              Todas
            </button>
            <button
              type="button"
              class="btn btn-sm rounded-pill"
              *ngFor="let c of ciudadesDisponibles"
              [ngClass]="ciudadFiltro === c ? 'btn-primary' : 'btn-outline-secondary'"
              (click)="ciudadFiltro = c"
            >
              {{ c }}
            </button>
          </div>

          <div *ngIf="cargando" class="text-center py-4 text-muted">Cargando destinos...</div>

          <div class="row g-3" *ngIf="!cargando">
            <div class="col-md-6" *ngFor="let d of destinosFiltrados; trackBy: trackByDestino">
              <div class="card h-100 shadow-sm border-0 p-3">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="badge bg-info text-dark">{{ d.ciudad }}</span>
                  <span class="text-warning fw-bold" [title]="'Calificación: ' + d.calificacion">
                    {{ renderEstrellas(d.calificacion) }} ({{ d.calificacion }})
                  </span>
                </div>
                <h5 class="fw-bold mt-2 mb-1">{{ d.nombre }}</h5>
                <p class="text-muted small flex-grow-1">{{ d.descripcion }}</p>
                <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                  <strong class="text-success">\${{ d.precio | number }} COP</strong>

                  <!-- Acciones con confirmación inline antes de eliminar -->
                  <div class="btn-group btn-group-sm" *ngIf="confirmarEliminarId !== d._id">
                    <button class="btn btn-outline-primary" (click)="iniciarEdicion(d)">Editar</button>
                    <button class="btn btn-outline-danger" (click)="confirmarEliminarId = d._id || null">Eliminar</button>
                  </div>
                  <div class="d-flex align-items-center gap-1" *ngIf="confirmarEliminarId === d._id">
                    <span class="small text-danger fw-semibold">¿Borrar?</span>
                    <button class="btn btn-danger btn-sm" (click)="eliminarDestino(d._id)">Sí</button>
                    <button class="btn btn-outline-secondary btn-sm" (click)="confirmarEliminarId = null">No</button>
                  </div>
                </div>
              </div>
            </div>
            <div *ngIf="destinosFiltrados.length === 0" class="col-12 text-center py-5 text-muted">
              No se encontraron destinos con el filtro actual.
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  title = 'Turismo MEAN';
  destinos: DestinoTuristico[] = [];
  filtro = '';
  ciudadFiltro = '';
  orden: 'recientes' | 'precio_asc' | 'precio_desc' | 'calificacion' = 'recientes';
  cargando = false;
  mensajeError = '';
  mensajeExito = '';
  editandoId: string | null = null;
  confirmarEliminarId: string | null = null;

  formulario: DestinoTuristico = this.crearFormularioVacio();

  constructor(public destinoService: DestinoService) {}

  ngOnInit(): void {
    this.cargarDestinos();
  }

  /** Optimiza `*ngFor` evitando recrear nodos DOM sin cambios. */
  trackByDestino(_index: number, item: DestinoTuristico): string {
    return item._id || item.nombre;
  }

  /** Retorna estrellas visuales (ej. `★★★★☆`) para la calificación. */
  renderEstrellas(calificacion: number): string {
    const llenas = Math.max(1, Math.min(5, Math.round(calificacion || 5)));
    return '★'.repeat(llenas) + '☆'.repeat(5 - llenas);
  }

  private crearFormularioVacio(): DestinoTuristico {
    return {
      nombre: '',
      ciudad: '',
      descripcion: '',
      precio: 850000,
      calificacion: 5
    };
  }

  /** Lista única de ciudades disponibles para las píldoras de filtro rápido. */
  get ciudadesDisponibles(): string[] {
    return Array.from(new Set(this.destinos.map((d) => d.ciudad.trim()).filter(Boolean)));
  }

  /** Lista filtrada por texto, ciudad y ordenada según selección. */
  get destinosFiltrados(): DestinoTuristico[] {
    const q = this.filtro.trim().toLowerCase();
    const list = this.destinos.filter((d) => {
      const matchCiudad = !this.ciudadFiltro || d.ciudad.trim() === this.ciudadFiltro;
      const matchQuery =
        !q ||
        d.nombre.toLowerCase().includes(q) ||
        d.ciudad.toLowerCase().includes(q) ||
        (d.descripcion || '').toLowerCase().includes(q);
      return matchCiudad && matchQuery;
    });

    switch (this.orden) {
      case 'precio_asc':
        return [...list].sort((a, b) => a.precio - b.precio);
      case 'precio_desc':
        return [...list].sort((a, b) => b.precio - a.precio);
      case 'calificacion':
        return [...list].sort((a, b) => b.calificacion - a.calificacion);
      default:
        return list;
    }
  }

  get precioPromedio(): number {
    const list = this.destinosFiltrados;
    if (!list.length) return 0;
    return Math.round(list.reduce((acc, d) => acc + Number(d.precio || 0), 0) / list.length);
  }

  get calificacionPromedio(): string {
    const list = this.destinosFiltrados;
    if (!list.length) return '0.0';
    const avg = list.reduce((acc, d) => acc + Number(d.calificacion || 0), 0) / list.length;
    return avg.toFixed(1);
  }

  cargarDestinos(): void {
    this.cargando = true;
    this.destinoService.obtenerDestinos().subscribe((list) => {
      this.destinos = list;
      this.cargando = false;
    });
  }

  guardarDestino(): void {
    this.mensajeError = '';
    this.mensajeExito = '';

    if (!this.formulario.nombre.trim() || !this.formulario.ciudad.trim()) {
      this.mensajeError = 'El nombre y la ciudad son obligatorios.';
      return;
    }
    if (this.formulario.precio < 0) {
      this.mensajeError = 'El precio no puede ser negativo.';
      return;
    }
    if (this.formulario.calificacion < 1 || this.formulario.calificacion > 5) {
      this.mensajeError = 'La calificación debe estar entre 1 y 5.';
      return;
    }

    if (this.editandoId) {
      this.destinoService.actualizarDestino(this.editandoId, this.formulario).subscribe((actualizado) => {
        this.destinos = this.destinos.map((d) => (d._id === this.editandoId ? actualizado : d));
        this.cancelarEdicion();
        this.mensajeExito = `Destino "${actualizado.nombre}" actualizado correctamente.`;
      });
    } else {
      this.destinoService.crearDestino(this.formulario).subscribe((creado) => {
        this.destinos = [creado, ...this.destinos];
        this.formulario = this.crearFormularioVacio();
        this.mensajeExito = `Destino "${creado.nombre}" registrado correctamente.`;
      });
    }
  }

  iniciarEdicion(destino: DestinoTuristico): void {
    this.editandoId = destino._id || null;
    this.formulario = { ...destino };
    this.mensajeError = '';
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.formulario = this.crearFormularioVacio();
    this.mensajeError = '';
  }

  eliminarDestino(id?: string): void {
    if (!id) return;
    this.destinoService.eliminarDestino(id).subscribe(() => {
      this.destinos = this.destinos.filter((d) => d._id !== id);
      this.confirmarEliminarId = null;
      if (this.editandoId === id) this.cancelarEdicion();
      this.mensajeExito = 'Destino eliminado del catálogo.';
    });
  }
}
