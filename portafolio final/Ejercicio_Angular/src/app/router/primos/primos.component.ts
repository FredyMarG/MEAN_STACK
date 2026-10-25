/**
 * ============================================================================
 * COMPONENTE NÚMEROS PRIMOS (primos.component.ts)
 * ============================================================================
 */
import { Component } from '@angular/core';

@Component({
  selector: 'app-primos',
  templateUrl: './primos.component.html',
  styleUrls: ['./primos.component.css']
})
export class PrimosComponent {
  numero: number = 2;

  esPrimo(): boolean {
    if (this.numero < 2) return false;
    for (let i = 2; i <= Math.sqrt(this.numero); i++) {
      if (this.numero % i === 0) return false;
    }
    return true;
  }
}
