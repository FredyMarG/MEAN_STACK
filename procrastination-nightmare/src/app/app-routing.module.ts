/**
 * ============================================================================
 * ENRUTADOR PRINCIPAL (procastination-nightmare/src/app/app-routing.module.ts)
 * ============================================================================
 * Propósito: Definir todas las rutas de la suite Procrastination Nightmare
 * en el mismo orden lógico de la barra lateral.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio.component';
import { PomodoroComponent } from './pages/pomodoro.component';
import { TareasComponent } from './pages/tareas.component';
import { NotasComponent } from './pages/notas.component';
import { CalendarioComponent } from './pages/calendario.component';
import { HabitosComponent } from './pages/habitos.component';
import { RoadmapComponent } from './pages/roadmap.component';
import { LandingComponent } from './pages/landing.component';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'pomodoro', component: PomodoroComponent },
  { path: 'tareas', component: TareasComponent },
  { path: 'notas', component: NotasComponent },
  { path: 'calendario', component: CalendarioComponent },
  { path: 'habitos', component: HabitosComponent },
  { path: 'roadmap', component: RoadmapComponent },
  { path: 'landing', component: LandingComponent },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
