import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NoPageFoundComponent } from './error/no-page-found.component';
import { SearchResultsComponent } from './browser/pages/search-results/search-results.component';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: '', pathMatch: 'prefix', loadChildren: () => import('./static/static.routes').then(m => m.staticRoutes) },
  { path: 'app', pathMatch: 'prefix', redirectTo: '' },
  { path: 'search', component: SearchResultsComponent },
  { path: 'term/:id', loadComponent: () => import('./browser/pages/term/term.component').then(m => m.TermComponent) },
  { path: 'diseases/:id', loadComponent: () => import('./browser/pages/disease/disease.component').then(m => m.DiseaseComponent) },
  { path: 'gene/:id', loadComponent: () => import('./browser/pages/gene/gene.component').then(m => m.GeneComponent) },
  { path: 'browse', loadChildren: () => import('./browser/browser.routes').then(m => m.browserRoutes) },
  { path: '**', component: NoPageFoundComponent }
];
