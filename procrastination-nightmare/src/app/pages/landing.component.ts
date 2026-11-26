/**
 * ============================================================================
 * COMPONENTE LANDING PAGE (src/app/pages/landing.component.ts)
 * ============================================================================
 * Propósito: Página promocional integrada en la SPA Angular con el logo SVG
 * oficial y las ilustraciones personalizadas de cada módulo.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  template: `
    <div class="pn-card p-4 p-md-5 text-white">
      <div class="row align-items-center g-4 mb-5">
        <div class="col-lg-6">
          <div class="d-flex align-items-center gap-2 mb-3">
            <img src="assets/img/logo.svg" alt="Logo Procrastination Nightmare" style="width: 44px; height: 44px;" />
            <span class="badge bg-info text-dark">Procrastination Nightmare</span>
          </div>
          <h1 class="display-6 fw-bold mb-3">Gana el control de tus días</h1>
          <p class="text-secondary mb-4">
            Centraliza, prioriza y avanza en tus proyectos combinando Pomodoro, Lista de tareas, Notas, Calendario, Hábitos y Roadmap en una sola SPA en Angular.
          </p>
          <div class="d-flex flex-wrap gap-2">
            <a routerLink="/inicio" class="btn btn-info text-dark fw-bold rounded-pill px-4">Ir al Dashboard</a>
            <a routerLink="/pomodoro" class="btn btn-outline-light rounded-pill px-4">Probar Pomodoro</a>
          </div>
        </div>
        <div class="col-lg-6 text-center">
          <img src="assets/img/hero-suite.svg" class="img-fluid rounded-4 shadow-lg" alt="Suite Procrastination Nightmare" />
        </div>
      </div>

      <h3 class="fw-bold mb-4 text-center">Módulos Destacados</h3>
      <div class="row g-4">
        <div class="col-md-4">
          <a routerLink="/calendario" class="text-decoration-none text-white">
            <div class="p-3 rounded-4 bg-dark border border-secondary h-100">
              <img src="assets/img/mod-calendario.svg" class="img-fluid rounded-3 mb-3" alt="Calendario" />
              <h5 class="fw-bold">Calendario de Eventos</h5>
              <p class="small text-secondary mb-0">Organiza y cancela eventos con subtareas por evento.</p>
            </div>
          </a>
        </div>
        <div class="col-md-4">
          <a routerLink="/roadmap" class="text-decoration-none text-white">
            <div class="p-3 rounded-4 bg-dark border border-secondary h-100">
              <img src="assets/img/mod-roadmap.svg" class="img-fluid rounded-3 mb-3" alt="Roadmap" />
              <h5 class="fw-bold">Roadmap de Tareas</h5>
              <p class="small text-secondary mb-0">Controla estados, filtros y búsqueda en tabla o tarjetas.</p>
            </div>
          </a>
        </div>
        <div class="col-md-4">
          <a routerLink="/pomodoro" class="text-decoration-none text-white">
            <div class="p-3 rounded-4 bg-dark border border-secondary h-100">
              <img src="assets/img/mod-pomodoro.svg" class="img-fluid rounded-3 mb-3" alt="Pomodoro" />
              <h5 class="fw-bold">Técnica Pomodoro</h5>
              <p class="small text-secondary mb-0">Anillo de progreso animado, alarma y contador de sesiones.</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  `
})
export class LandingComponent {}
