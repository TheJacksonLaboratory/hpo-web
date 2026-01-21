import { Routes } from '@angular/router';
import { NoPageFoundComponent } from './error/no-page-found.component';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'prefix', loadChildren: () => import('./static/static.routes').then(m => m.staticRoutes) },
  { path: 'app', pathMatch: 'prefix', redirectTo: '' },
  { path: 'browse', loadChildren: () => import('./browser/browser.routes').then(m => m.browserRoutes) },
  { path: '**', component: NoPageFoundComponent }
];
