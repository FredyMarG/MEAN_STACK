/**
 * ============================================================================
 * MÓDULO PRINCIPAL DE TURISMO MEAN (Turismo_MEAN/TurismoFront/src/app/app.module.ts)
 * ============================================================================
 * Propósito: Declarar los componentes de la aplicación Angular e importar
 * `BrowserModule`, `FormsModule` (para enlace bidireccional `[(ngModel)]`) y
 * `HttpClientModule` (para consumir la API REST de `TurismoBack`).
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
