/**
 * ============================================================================
 * COMPONENTE CALCULADORA (calculadora.component.ts)
 * ============================================================================
 * Propósito: Realizar las 4 operaciones aritméticas básicas (+, -, *, /) con
 * validación de entradas, protección contra división por cero e historial
 * reciente de las últimas 5 operaciones.
 */
import { Component } from '@angular/core';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.css']
})
export class CalculadoraComponent {
  // Operandos enlazados bidireccionalmente con [(ngModel)] en la vista
  num1: number | null = 0;
  num2: number | null = 0;
  // Resultado actual mostrado en pantalla (o null si hubo error)
  resultado: number | null = 0;
  // Mensaje de error de validación o división entre cero
  errorMsg: string = '';
  // Historial reciente de las últimas 5 operaciones realizadas
  historial: string[] = [];

  /**
   * Ejecuta la operación aritmética seleccionada validando ambos operandos.
   * @param op - Operador matemático (`+`, `-`, `*` o `/`).
   */
  operar(op: '+' | '-' | '*' | '/'): void {
    this.errorMsg = '';

    // Verifica que ambos inputs contengan números finitos válidos
    if (this.num1 === null || this.num2 === null || !Number.isFinite(this.num1) || !Number.isFinite(this.num2)) {
      this.errorMsg = 'Ingresa ambos números para calcular.';
      this.resultado = null;
      return;
    }

    // Protege contra división matemática entre cero
    if (op === '/' && this.num2 === 0) {
      this.errorMsg = 'No se puede dividir entre cero.';
      this.resultado = null;
      return;
    }

    // Ejecuta la operación y redondea la división a 4 decimales
    switch (op) {
      case '+': this.resultado = this.num1 + this.num2; break;
      case '-': this.resultado = this.num1 - this.num2; break;
      case '*': this.resultado = this.num1 * this.num2; break;
      case '/': this.resultado = Number((this.num1 / this.num2).toFixed(4)); break;
    }

    // Registra la operación al principio del historial conservando máximo 5 entradas
    const entrada = `${this.num1} ${op} ${this.num2} = ${this.resultado}`;
    this.historial = [entrada, ...this.historial].slice(0, 5);
  }

  /** Limpia el historial reciente de operaciones. */
  limpiarHistorial(): void {
    this.historial = [];
  }
}
