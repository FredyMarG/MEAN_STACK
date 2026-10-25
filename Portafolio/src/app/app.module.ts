/**
 * ============================================================================
 * MÓDULO RAÍZ DE ANGULAR: PORTAFOLIO SPA (Portafolio/src/app/app.module.ts)
 * ============================================================================
 * Propósito: Integrar la arquitectura basada en componentes del portafolio en
 * Angular (`NavBarComponent`, `SobreMiComponent`, `PortafolioComponent`).
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SobreMiComponent } from './components/sobre-mi/sobre-mi.component';
import { PortafolioComponent } from './components/portafolio/portafolio.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    SobreMiComponent,
    PortafolioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
