import { Routes } from '@angular/router';
import { TermComponent } from './pages/term/term.component';
import { DiseaseComponent } from './pages/disease/disease.component';
import { GeneComponent } from './pages/gene/gene.component';
import { ProfileSearchComponent } from "./pages/profile-search/profile-search.component";

export const browserRoutes: Routes = [
  { path: 'term/:id', component: TermComponent },
  { path: 'disease/:id', component: DiseaseComponent },
  { path: 'gene/:id', component: GeneComponent },
  { path: 'profile-search', component: ProfileSearchComponent },
  // Backwards compatibility: search moved to the top-level /search route.
  // A plain string redirectTo drops query params, so this preserves q/navFilter.
  {
    path: 'search',
    pathMatch: 'full',
    redirectTo: ({ queryParams }) => {
      const params = new URLSearchParams(queryParams as Record<string, string>).toString();
      return params ? `/search?${params}` : '/search';
    }
  }
];
