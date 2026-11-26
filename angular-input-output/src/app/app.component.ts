/**
 * ============================================================================
 * COMPONENTE RAÍZ PADRE (angular-input-output/src/app/app.component.ts)
 * ============================================================================
 * Propósito educativo (Curso MEAN Stack):
 * Demostrar la comunicación Padre -> Hijo (`@Input()`) e Hijo -> Padre (`@Output()`)
 * en Angular usando el componente reutilizable `<app-button>`:
 * - El padre (`AppComponent`) envía `label`, `variant` y `disabled` al hijo.
 * - El hijo (`ButtonComponent`) emite `(clicked)` y el padre ejecuta `registrarClic()`.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Título identificador de la aplicación Angular
  title: string = 'Angular @Input / @Output';
  // Contador total de interacciones recibidas desde los botones hijos
  contador: number = 0;
  // Nombre del último botón hijo que emitió el evento `(clicked)`
  ultimoEvento: string = '';

  /**
   * Manejador ejecutado por el padre cada vez que un `<app-button>` hijo emite `(clicked)`.
   * @param nombre - Etiqueta identificadora del botón presionado.
   */
  registrarClic(nombre: string): void {
    this.contador++;
    this.ultimoEvento = nombre;
  }

  /** Reinicia el contador y el registro del último evento. */
  reiniciarContador(): void {
    this.contador = 0;
    this.ultimoEvento = '';
  }
}
