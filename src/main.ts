import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import { EchoPreset } from '@jax-data-science/themes';
import { MAT_TABS_CONFIG } from '@angular/material/tabs';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { environment } from './environments/environment';
import { definePreset } from '@primeuix/themes';
if (environment.production) {
  enableProdMode();
}
 const HpoTheme = definePreset(EchoPreset, {
    semantic: {
      primary: {
        50: '{cyan.50}',
        100: '{cyan.100}',
        200: '{cyan.200}',
        300: '{cyan.300}',
        400: '{cyan.400}',
        500: '{cyan.500}',
        600: '{cyan.600}',
        700: '{cyan.700}',
        800: '{cyan.800}',
        900: '{cyan.900}',
      },
      colorScheme: {
        light: {
          surface: {
            0: '#ffffff',
            50: '{grey.100}',
            100: '{grey.200}',
            200: '{grey.300}',
            300: '{grey.300}',
            400: '{grey.500}',
            500: '{grey.700}',
            600: '{grey.800}',
            700: '{grey.900}',
            800: '{grey.900}',
            900: '{grey.1000}',
            950: '{grey.1000}'
          }
        },
        dark: {
          surface: {
            0: '#ffffff',
            50: '{slate.50}',
            100: '{slate.100}',
            200: '{slate.200}',
            300: '{slate.300}',
            400: '{slate.400}',
            500: '{slate.500}',
            600: '{slate.600}',
            700: '{slate.700}',
            800: '{slate.800}',
            900: '{slate.900}',
            950: '{slate.950}'
          }
        }
      },
    },
    components: {
      menubar: {
        colorScheme: {
          light: {
            root: {
              background: '{teal.400}',
              color: '#000000'
            },
            item: {
              color: '#000000'
            }
          }
        }
      },
      message: {
        colorScheme: {
          light: {
            info: {
              background: '{teal.50}',
              borderColor: '{teal.300}',
              color: '{teal.700}'
            }
          }
        }
      },
      button: {
         colorScheme: {
          light: {
            link: {
              color: '{primary.700}',
            }
          }
        }
      },
      select: {
        option: {
          focusBackground: '{primary.50}'
        }
      },
      tabs: {
        tablist: {
          background: 'white',
        },
        tab: {
          borderWidth: '0 0 1px 0',
          color: '#636363',
          activeColor: '{primary.700}',
          borderColor: '#D9D9D9',
          hoverBorderColor: '#D9D9D9',
          activeBorderColor: '{primary.700}',
        },
        colorScheme: {
          light: {
            tab: {
              background: 'rgba(0, 0, 0, 0)',
              hoverBackground: '{primary.50}'
            }
          }
        }
      }
    }
  });
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: HpoTheme,
        options: {
          darkModeSelector: '.dark-mode'
        }
      }
    }),
    { provide: MAT_TABS_CONFIG, useValue: { animationDuration: '0ms' } }
  ]
}).catch(err => console.error(err));
