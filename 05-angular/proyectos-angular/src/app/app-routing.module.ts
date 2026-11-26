/**
 * ============================================================================
 * ENRUTADOR PRINCIPAL — PORTAFOLIO (Portafolio/src/app/app-routing.module.ts)
 * ============================================================================
 * Propósito: Configurar las rutas SPA entre la vitrina de proyectos
 * (`/proyectos`) y el perfil profesional (`/sobre-mi`), con redirección segura.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortafolioComponent } from './components/portafolio/portafolio.component';
import { SobreMiComponent } from './components/sobre-mi/sobre-mi.component';

// Definición de rutas de la SPA
const routes: Routes = [
  { path: '', redirectTo: 'proyectos', pathMatch: 'full' }, // Ruta inicial por defecto
  { path: 'proyectos', component: PortafolioComponent },    // Vitrina filtrable de proyectos
  { path: 'sobre-mi', component: SobreMiComponent },        // Perfil profesional y stack
  { path: '**', redirectTo: 'proyectos' }                   // Comodín ante rutas inválidas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
