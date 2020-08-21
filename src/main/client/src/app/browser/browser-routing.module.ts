// Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { TermComponent } from './pages/term/term.component';
import { DiseaseComponent } from './pages/disease/disease.component';
import { GeneComponent } from './pages/gene/gene.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { ProfileSearchComponent } from "./pages/profile-search/profile-search.component";

const browserRoutes: Routes = [
    { path: 'term/:id', component: TermComponent },
    { path: 'disease/:id', component: DiseaseComponent},
    { path: 'gene/:id', component: GeneComponent },
    { path: 'search', component: SearchResultsComponent },
    { path: 'profile-search', component: ProfileSearchComponent }
];
export const browserRouting = RouterModule.forChild(browserRoutes);
@NgModule({
  imports: [
    RouterModule,
    browserRouting
  ],
 exports: [ RouterModule ]
})
export class BrowserRoutingModule {}
