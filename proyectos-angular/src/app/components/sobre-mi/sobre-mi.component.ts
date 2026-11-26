/**
 * ============================================================================
 * COMPONENTE SOBRE MÍ (Portafolio/src/app/components/sobre-mi/sobre-mi.component.ts)
 * ============================================================================
 * Propósito: Presentar el perfil profesional, resumen del stack MEAN y
 * habilidades clave del desarrollador.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'app-sobre-mi',
  templateUrl: './sobre-mi.component.html',
  styleUrls: ['./sobre-mi.component.css']
})
export class SobreMiComponent {
  // Datos principales del perfil
  readonly nombre: string = 'Fredy Martinez';
  readonly profesion: string = 'Software Developer & Scrum Master';
  readonly resumen: string =
    'Desarrollador Full-Stack enfocado en arquitecturas limpias con MongoDB, Express.js, Angular y Node.js/TypeScript, aplicando buenas prácticas de seguridad, pruebas automatizadas y metodologías ágiles.';

  // Habilidades técnicas destacadas en formato insignia
  readonly habilidades: string[] = [
    'MongoDB & Mongoose',
    'Express.js REST & JWT',
    'Angular 16 SPA',
    'Node.js & TypeScript',
    'Bootstrap 5 & CSS3',
    'Scrum & GitHub'
  ];
}
