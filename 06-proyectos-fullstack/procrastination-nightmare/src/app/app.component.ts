/**
 * ============================================================================
 * COMPONENTE SHELL RAÍZ (procastination-nightmare/src/app/app.component.ts)
 * ============================================================================
 * Propósito: Proveer la barra lateral colapsable con iconos Flaticon, logo SVG
 * e iluminación automática de ruta activa, además de navegación móvil.
 */

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Procrastination Nightmare';

  /** Elementos de navegación de la barra lateral con iconos Flaticon. */
  navItems = [
    { path: '/inicio', label: 'Inicio', icon: 'fi-rr-home' },
    { path: '/pomodoro', label: 'Pomodoro', icon: 'fi-rr-clock' },
    { path: '/tareas', label: 'Lista de tareas', icon: 'fi-rr-check-circle' },
    { path: '/notas', label: 'Notas', icon: 'fi-rr-document' },
    { path: '/calendario', label: 'Calendario', icon: 'fi-rr-calendar' },
    { path: '/habitos', label: 'Hábitos', icon: 'fi-rr-refresh' },
    { path: '/roadmap', label: 'Roadmap', icon: 'fi-rr-table-list' },
    { path: '/landing', label: 'Landing', icon: 'fi-rr-globe' }
  ];

  constructor(private router: Router) {}

  /** Navega a la ruta seleccionada desde el menú desplegable móvil. */
  navegarMobile(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    if (val) this.router.navigateByUrl(val);
  }
}
