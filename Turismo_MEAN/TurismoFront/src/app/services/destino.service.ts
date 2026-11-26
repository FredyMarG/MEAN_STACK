/**
 * ============================================================================
 * SERVICIO HTTP DE DESTINOS (Turismo_MEAN/TurismoFront/src/app/services/destino.service.ts)
 * ============================================================================
 * Propósito: Encapsular toda la comunicación REST con `TurismoBack` en
 * `http://localhost:4000/api/destinos`, proveyendo un respaldo transparente en
 * `localStorage` cuando el servidor backend no se encuentra en ejecución.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

/** Modelo tipado de un destino turístico en el frontend Angular. */
export interface DestinoTuristico {
  _id?: string;
  nombre: string;
  ciudad: string;
  descripcion: string;
  precio: number;
  calificacion: number;
  fechaCreacion?: string;
}

const STORAGE_KEY = 'turismo_mean_destinos_v1';

/** Datos iniciales para demostración cuando la API está apagada. */
const SEED_DESTINOS: DestinoTuristico[] = [
  {
    _id: 'local-1',
    nombre: 'Ciudad Amurallada & Islas del Rosario',
    ciudad: 'Cartagena',
    descripcion: 'Recorrido histórico colonial y día de playa en aguas cristalinas.',
    precio: 1450000,
    calificacion: 5
  },
  {
    _id: 'local-2',
    nombre: 'Valle de Cocora & Ruta del Café',
    ciudad: 'Salento, Quindío',
    descripcion: 'Caminata ecológica entre palmas de cera y cata de café de origen.',
    precio: 980000,
    calificacion: 5
  }
];

@Injectable({ providedIn: 'root' })
export class DestinoService {
  private readonly apiUrl = 'http://localhost:4000/api/destinos';

  /** Indica si la última operación usó el respaldo offline `localStorage`. */
  public modoOffline = false;

  constructor(private http: HttpClient) {}

  /** Lee destinos desde `localStorage` o inicializa los datos semilla. */
  private leerLocal(): DestinoTuristico[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Si el JSON está corrupto se regenera la semilla
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DESTINOS));
    return [...SEED_DESTINOS];
  }

  /** Persiste la lista actual de destinos en `localStorage`. */
  private guardarLocal(destinos: DestinoTuristico[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(destinos));
  }

  /**
   * Consulta todos los destinos desde la API REST.
   * Si falla la conexión, retorna los datos almacenados en `localStorage`.
   */
  obtenerDestinos(): Observable<DestinoTuristico[]> {
    return this.http.get<{ ok: boolean; destinos: DestinoTuristico[] }>(this.apiUrl).pipe(
      map((res) => res.destinos || []),
      tap((list) => {
        this.modoOffline = false;
        this.guardarLocal(list);
      }),
      catchError(() => {
        this.modoOffline = true;
        return of(this.leerLocal());
      })
    );
  }

  /** Registra un nuevo destino en la API o en `localStorage`. */
  crearDestino(destino: DestinoTuristico): Observable<DestinoTuristico> {
    return this.http.post<{ ok: boolean; data: DestinoTuristico }>(this.apiUrl, destino).pipe(
      map((res) => res.data),
      tap(() => { this.modoOffline = false; }),
      catchError(() => {
        this.modoOffline = true;
        const nuevo: DestinoTuristico = {
          ...destino,
          _id: `local-${Date.now()}`,
          fechaCreacion: new Date().toISOString()
        };
        const list = [nuevo, ...this.leerLocal()];
        this.guardarLocal(list);
        return of(nuevo);
      })
    );
  }

  /** Actualiza un destino existente por su identificador `_id`. */
  actualizarDestino(id: string, cambios: Partial<DestinoTuristico>): Observable<DestinoTuristico> {
    return this.http.put<{ ok: boolean; data: DestinoTuristico }>(`${this.apiUrl}/${id}`, cambios).pipe(
      map((res) => res.data),
      tap(() => { this.modoOffline = false; }),
      catchError(() => {
        this.modoOffline = true;
        const list = this.leerLocal().map((d) => (d._id === id ? { ...d, ...cambios } : d));
        this.guardarLocal(list);
        return of(list.find((d) => d._id === id) as DestinoTuristico);
      })
    );
  }

  /** Elimina un destino por su identificador `_id`. */
  eliminarDestino(id: string): Observable<boolean> {
    return this.http.delete<{ ok: boolean }>(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      tap(() => { this.modoOffline = false; }),
      catchError(() => {
        this.modoOffline = true;
        const list = this.leerLocal().filter((d) => d._id !== id);
        this.guardarLocal(list);
        return of(true);
      })
    );
  }
}
