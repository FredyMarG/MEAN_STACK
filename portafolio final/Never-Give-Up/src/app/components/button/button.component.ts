/**
 * ============================================================================
 * COMPONENTE DE BOTÓN REUTILIZABLE (Never-Give-Up/src/app/components/button/button.component.ts)
 * ============================================================================
 */
import { Component } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  label: string = 'Never Give Up!';
}
