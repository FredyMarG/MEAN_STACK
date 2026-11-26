/**
 * ============================================================================
 * COMPONENTE DE VERIFICACIÓN DE EDAD (edad.component.ts)
 * ============================================================================
 * Propósito: Validar si una edad ingresada corresponde a una persona mayor o
 * menor de edad, con validación de rango (0–120 años) e historial persistente
 * en `localStorage`.
 */
import { Component } from '@angular/core';

const STORAGE_KEY = 'ej_angular_edad';

@Component({
  selector: 'app-edad',
  templateUrl: './edad.component.html',
  styleUrls: ['./edad.component.css']
})
export class EdadComponent {
  // Edad actual enlazada con [(ngModel)] en el formulario
  edad: number | null = 18;
  // Lista de últimas 5 verificaciones cargadas desde localStorage
  historial: { edad: number; estado: string }[] = this.cargarHistorial();

  /** Lee de forma segura el historial guardado en `localStorage`. */
  private cargarHistorial(): { edad: number; estado: string }[] {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /** Indica si la edad ingresada es un número finito dentro del rango válido (0–120). */
  get esValida(): boolean {
    return this.edad !== null && Number.isFinite(this.edad) && this.edad >= 0 && this.edad <= 120;
  }

  /** Retorna el mensaje descriptivo o advertencia según la edad actual. */
  get mensajeEstado(): string {
    if (this.edad === null || !Number.isFinite(this.edad)) return 'Ingresa una edad numérica válida.';
    if (this.edad < 0 || this.edad > 120) return 'La edad debe estar entre 0 y 120 años.';
    return this.edad >= 18 ? 'Es mayor de edad' : 'Es menor de edad';
  }

  /** Guarda la verificación actual en el historial (máximo 5 registros) y en `localStorage`. */
  guardarRegistro(): void {
    if (!this.esValida || this.edad === null) return;
    this.historial = [{ edad: this.edad, estado: this.mensajeEstado }, ...this.historial].slice(0, 5);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.historial));
  }

  /** Elimina todo el historial guardado tanto en memoria como en `localStorage`. */
  limpiarHistorial(): void {
    this.historial = [];
    localStorage.removeItem(STORAGE_KEY);
  }
}
