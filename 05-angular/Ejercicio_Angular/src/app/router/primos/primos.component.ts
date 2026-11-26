/**
 * ============================================================================
 * COMPONENTE NÚMEROS PRIMOS (primos.component.ts)
 * ============================================================================
 * Propósito: Evaluar primalidad de enteros positivos en O(sqrt(n)) y calcular
 * el siguiente número primo en la recta numérica dentro de un rango seguro.
 */
import { Component } from '@angular/core';

// Tope máximo permitido para evitar congelar el hilo principal del navegador
const MAX_PRIMO_INPUT = 1_000_000;

@Component({
  selector: 'app-primos',
  templateUrl: './primos.component.html',
  styleUrls: ['./primos.component.css']
})
export class PrimosComponent {
  // Número ingresado por el usuario en el input
  numero: number | null = 2;

  /** Valida que `numero` sea entero y esté dentro del rango seguro `0 .. 1,000,000`. */
  get esEnteroValido(): boolean {
    return (
      this.numero !== null &&
      Number.isInteger(this.numero) &&
      this.numero >= 0 &&
      this.numero <= MAX_PRIMO_INPUT
    );
  }

  /** Indica si el número ingresado es actualmente un número primo. */
  get resultadoPrimo(): boolean {
    if (!this.esEnteroValido || this.numero === null) return false;
    return this.verificarPrimo(this.numero);
  }

  /** Busca el primer número primo estrictamente mayor que `numero`. */
  get siguientePrimo(): number | null {
    if (!this.esEnteroValido || this.numero === null) return null;
    let candidato = Math.max(2, this.numero + 1);
    while (!this.verificarPrimo(candidato)) {
      candidato++;
    }
    return candidato;
  }

  /**
   * Comprueba primalidad en complejidad O(sqrt(n)) evaluando solo divisores impares.
   * @param n - Entero positivo a verificar.
   */
  private verificarPrimo(n: number): boolean {
    if (n < 2) return false;                    // Menores que 2 no son primos
    if (n === 2) return true;                   // 2 es el único primo par
    if (n % 2 === 0) return false;              // Descarta múltiplos de 2
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) return false;            // Encontró un divisor exacto
    }
    return true;
  }
}
