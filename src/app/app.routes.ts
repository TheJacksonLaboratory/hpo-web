import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NoPageFoundComponent } from './error/no-page-found.component';
import { SearchResultsComponent } from './browser/pages/search-results/search-results.component';
import { EntityType } from './browser/models/models';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: '', pathMatch: 'prefix', loadChildren: () => import('./static/static.routes').then(m => m.staticRoutes) },
  { path: 'app', pathMatch: 'prefix', redirectTo: '' },
  { path: 'search', component: SearchResultsComponent },
  // All three entity types share EntityPageComponent, told apart by entityType.
  {
    path: 'term/:id',
    loadComponent: () => import('./browser/pages/entity/entity-page.component').then(m => m.EntityPageComponent),
    data: { entityType: EntityType.PHENOTYPE }
  },
  {
    path: 'gene/:id',
    loadComponent: () => import('./browser/pages/entity/entity-page.component').then(m => m.EntityPageComponent),
    data: { entityType: EntityType.GENE }
  },
  {
    path: 'disease/:id',
    loadComponent: () => import('./browser/pages/entity/entity-page.component').then(m => m.EntityPageComponent),
    data: { entityType: EntityType.DISEASE }
  },
  { path: 'browse', loadChildren: () => import('./browser/browser.routes').then(m => m.browserRoutes) },
  { path: '**', component: NoPageFoundComponent }
];
