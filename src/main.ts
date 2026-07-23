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
            50: '{teal.50}',
            100: '{teal.100}',
            200: '{teal.200}',
            300: '{teal.300}',
            400: '{teal.400}',
            500: '{teal.500}',
            600: '{teal.600}',
            700: '{teal.700}',
            800: '{teal.800}',
            900: '{teal.900}',
          },
          formField: {
            placeholderColor: '{gray.600}'
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
      tabs: {
        // No border on the tablist container itself: its border-box is 1px taller than
        // each .p-tab child (border adds to its own height), so a border here always
        // lands 1px below each tab's own border-bottom. Drawing the line on the tabs
        // themselves instead keeps every tab's border on the same pixel row.
        tablist: {
          background: 'white',
        },
        tab: {
          borderWidth: '0 0 1px 0',
          color: '#636363',
          activeColor: '{primary.700}',
          borderColor: '#D9D9D9',
          activeBorderColor: '{primary.700}',
        },
        colorScheme: {
          light: {
            tab: {
              background: 'rgba(0, 0, 0, 0)'
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
