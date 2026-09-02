import { Routes } from '@angular/router';
import { DiseaseComponent } from './pages/disease/disease.component';
import { GeneComponent } from './pages/gene/gene.component';
import { ProfileSearchComponent } from "./pages/profile-search/profile-search.component";
import { EntityPageComponent } from './pages/entity/entity-page.component';
import { EntityType } from './models/models';

export const browserRoutes: Routes = [
  // Migrated to the shared EntityPageComponent (HPO-68). Gene/disease are migrated
  // in their own steps - see docs/adr/0001-HPO-68-unified-entity-page.md.
  { path: 'term/:id', component: EntityPageComponent, data: { entityType: EntityType.PHENOTYPE } },
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
