/**
 * ============================================================================
 * MÓDULO PRINCIPAL (procastination-nightmare/src/app/app.module.ts)
 * ============================================================================
 * Propósito: Declarar el shell raíz (`AppComponent`) y las 8 páginas de la
 * suite Procrastination Nightmare.
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './pages/inicio.component';
import { PomodoroComponent } from './pages/pomodoro.component';
import { TareasComponent } from './pages/tareas.component';
import { NotasComponent } from './pages/notas.component';
import { CalendarioComponent } from './pages/calendario.component';
import { HabitosComponent } from './pages/habitos.component';
import { RoadmapComponent } from './pages/roadmap.component';
import { LandingComponent } from './pages/landing.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    PomodoroComponent,
    TareasComponent,
    NotasComponent,
    CalendarioComponent,
    HabitosComponent,
    RoadmapComponent,
    LandingComponent
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
