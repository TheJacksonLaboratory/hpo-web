import { inject } from '@angular/core';
import { RedirectFunction, Router, Routes } from '@angular/router';
import { DataHomeComponent, DataTab } from './data-home/data-home.component';

/**
 * A string `redirectTo` builds its query params from the redirect string alone, so any
 * params on the incoming link are dropped. Returning a UrlTree lets us carry them over.
 */
const toTab = (tab: DataTab): RedirectFunction => ({ queryParams }) =>
  inject(Router).createUrlTree(['/data'], { queryParams: { ...queryParams, tab } });

export const dataRoutes: Routes = [
  { path: '', component: DataHomeComponent },
  { path: 'ontology', pathMatch: 'full', redirectTo: toTab('ontology') },
  { path: 'annotations', pathMatch: 'full', redirectTo: toTab('annotations') },
  { path: 'api', pathMatch: 'full', redirectTo: toTab('api') },
];
