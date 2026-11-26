/**
 * ============================================================================
 * COMPONENTE BOTÓN REUTILIZABLE HIJO (src/app/components/button/button.component.ts)
 * ============================================================================
 * Propósito educativo (Curso MEAN Stack):
 * Enseñar cómo crear un componente UI desacoplado y reutilizable en Angular:
 * - `@Input()` recibe datos configurables desde el componente padre.
 * - `@Output()` con `EventEmitter` notifica eventos al componente padre.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  /** Texto visible dentro del botón recibido desde el padre. */
  @Input() label: string = 'Botón';

  /** Variante visual Bootstrap (`primary`, `success`, `warning`, `danger`). */
  @Input() variant: 'primary' | 'success' | 'warning' | 'danger' = 'primary';

  /** Si es `true`, deshabilita el botón e impide emitir clics. */
  @Input() disabled: boolean = false;

  /** Evento emitido hacia el componente padre al hacer clic válido. */
  @Output() clicked = new EventEmitter<void>();

  /** Maneja el clic nativo del DOM y emite `(clicked)` solo si no está deshabilitado. */
  onClick(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
