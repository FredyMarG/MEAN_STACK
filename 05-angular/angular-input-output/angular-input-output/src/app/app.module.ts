/**
 * ============================================================================
 * ARCHIVO: Never-Give-Up/src/app/app.module.ts
 * DESCRIPCIÓN: Componente botón reutilizable con @Input/@Output en Angular (Never-Give-Up).
 * ============================================================================
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './components/button/button.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
