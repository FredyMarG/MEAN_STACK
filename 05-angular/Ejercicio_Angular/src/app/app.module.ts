/**
 * ============================================================================
 * MÓDULO RAÍZ DE ANGULAR: EJERCICIO MULTIRRUTA (Ejercicio_Angular/src/app/app.module.ts)
 * ============================================================================
 * Propósito: Declarar los componentes de la aplicación (`HomeComponent`,
 * `EdadComponent`, `NavBarComponent`, `CalculadoraComponent`, `PrimosComponent`)
 * e importar `FormsModule` para enlace de datos bidireccional (`[(ngModel)]`)
 * junto con `AppRoutingModule` para navegación SPA.
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './router/home/home.component';
import { EdadComponent } from './router/edad/edad.component';
import { NavBarComponent } from './router/nav-bar/nav-bar.component';
import { FormsModule } from '@angular/forms';
import { CalculadoraComponent } from './router/calculadora/calculadora.component';
import { PrimosComponent } from './router/primos/primos.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EdadComponent,
    NavBarComponent,
    CalculadoraComponent,
    PrimosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
