import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './router/home/home.component';
import { EdadComponent } from './router/edad/edad.component';
import { CalculadoraComponent } from './router/calculadora/calculadora.component';
import { PrimosComponent } from './router/primos/primos.component';

const routes: Routes = [
  { path : "", component:HomeComponent},
  { path : "home", component: HomeComponent},
  { path : "edad", component: EdadComponent},
  { path : "calculadora", component:CalculadoraComponent},
  { path : "primo", component: PrimosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
