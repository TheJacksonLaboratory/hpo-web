import { Routes } from '@angular/router';
import { ProfileSearchComponent } from "./pages/profile-search/profile-search.component";

export const browserRoutes: Routes = [
  // Backwards compatibility: term/disease/gene pages moved to top-level routes.
  { path: 'term/:id', redirectTo: '/term/:id' },
  { path: 'disease/:id', redirectTo: '/diseases/:id' },
  { path: 'gene/:id', redirectTo: '/gene/:id' },
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
