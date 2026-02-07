  // app.config.ts
  import { ApplicationConfig, importProvidersFrom } from '@angular/core';
  import { provideRouter } from '@angular/router';
  import { provideClientHydration } from '@angular/platform-browser';
  import { routes } from './app.routes';
  import { LucideAngularModule, Store } from 'lucide-angular';

  export const appConfig: ApplicationConfig = {
    providers: [
      provideRouter(routes),
      provideClientHydration(),
      importProvidersFrom(
        LucideAngularModule.pick({
          Store,
        })
      )
    ]
  };