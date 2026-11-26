/**
 * ============================================================================
 * ENRUTADOR PRINCIPAL (Ejercicio_Angular/src/app/app-routing.module.ts)
 * ============================================================================
 * Propósito: Definir las rutas de navegación SPA con ruta comodín (`**`)
 * hacia `/home` para evitar vistas en blanco ante URLs desconocidas.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './router/home/home.component';
import { EdadComponent } from './router/edad/edad.component';
import { CalculadoraComponent } from './router/calculadora/calculadora.component';
import { PrimosComponent } from './router/primos/primos.component';

// Tabla de rutas SPA: cada `path` renderiza su componente dentro de <router-outlet>
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Ruta raíz redirige a /home
  { path: 'home', component: HomeComponent },          // Bienvenida del módulo
  { path: 'edad', component: EdadComponent },          // Verificador de edad
  { path: 'calculadora', component: CalculadoraComponent }, // Calculadora básica
  { path: 'primo', component: PrimosComponent },       // Detector de números primos
  { path: '**', redirectTo: 'home' }                   // Comodín 404: evita pantallas vacías
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],             // Registra las rutas en la raíz de la app
  exports: [RouterModule]                              // Expone RouterModule al resto de la app
})
export class AppRoutingModule {}
