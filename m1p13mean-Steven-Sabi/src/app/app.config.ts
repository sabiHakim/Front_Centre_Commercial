  // app.config.ts
  import { ApplicationConfig, importProvidersFrom } from '@angular/core';
  import { provideRouter } from '@angular/router';
  import { provideClientHydration } from '@angular/platform-browser';
  import { routes } from './app.routes';
  import { LucideAngularModule, Store } from 'lucide-angular';
import { provideHttpClient } from '@angular/common/http';

  export const appConfig: ApplicationConfig = {
    providers: [
      provideRouter(routes),
      provideClientHydration(),
      provideHttpClient(),
      importProvidersFrom(
        LucideAngularModule.pick({
          Store,
        })
      )
    ]
  };