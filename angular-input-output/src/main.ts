/**
 * ============================================================================
 * ARCHIVO: Never-Give-Up/src/main.ts
 * DESCRIPCIÓN: Componente botón reutilizable con @Input/@Output en Angular (Never-Give-Up).
 * ============================================================================
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
