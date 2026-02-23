  // app.config.ts
  import { ApplicationConfig, importProvidersFrom } from '@angular/core';
  import { provideRouter } from '@angular/router';
  import { provideClientHydration } from '@angular/platform-browser';
  import { routes } from './app.routes';
  import { LucideAngularModule, Store } from 'lucide-angular';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { authInterceptor } from './auth.interceptor'; withInterceptors([authInterceptor])

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