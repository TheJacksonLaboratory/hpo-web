import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import { EchoPreset } from '@jax-data-science/themes';
import { MAT_TABS_CONFIG } from '@angular/material/tabs';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: EchoPreset,
        options: {
          darkModeSelector: '.dark-mode'
        }
      }
    }),
    { provide: MAT_TABS_CONFIG, useValue: { animationDuration: '0ms' } }
  ]
}).catch(err => console.error(err));
