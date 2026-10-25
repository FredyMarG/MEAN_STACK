/**
 * ============================================================================
 * COMPONENTE SOBRE MÍ (sobre-mi.component.ts)
 * ============================================================================
 */
import { Component } from '@angular/core';

@Component({
  selector: 'app-sobre-mi',
  templateUrl: './sobre-mi.component.html',
  styleUrls: ['./sobre-mi.component.css']
})
export class SobreMiComponent {
  nombre: string = 'Fredy Martinez';
  profesion: string = 'Software Developer & Scrum Master';
}
