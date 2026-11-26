/**
 * ============================================================================
 * ARCHIVO: Ejercicio_Angular/src/main.ts
 * DESCRIPCIÓN: Componente o archivo de la SPA multirruta en Angular (Ejercicio_Angular).
 * ============================================================================
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
