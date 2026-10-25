/**
 * ============================================================================
 * COMPONENTE DE VERIFICACIÓN DE EDAD (edad.component.ts)
 * ============================================================================
 */
import { Component } from '@angular/core';

@Component({
  selector: 'app-edad',
  templateUrl: './edad.component.html',
  styleUrls: ['./edad.component.css']
})
export class EdadComponent {
  edad: number = 18;

  esMayorDeEdad(): string {
    return this.edad >= 18 ? 'Es mayor de edad' : 'Es menor de edad';
  }
}
