import { Routes } from '@angular/router';
import { DataHomeComponent } from './data-home/data-home.component';

export const dataRoutes: Routes = [
  { path: '', component: DataHomeComponent },
  { path: 'ontology', pathMatch: 'full', redirectTo: '/data' },
  { path: 'annotations', pathMatch: 'full', redirectTo: '/data?tab=annotations' },
  { path: 'api', pathMatch: 'full', redirectTo: '/data?tab=api' },
];
