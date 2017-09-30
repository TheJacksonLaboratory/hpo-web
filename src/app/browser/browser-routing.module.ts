// Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { MainSearchComponent } from './search/search.component';
import { TermComponent } from './term/term.component';
import { DiseaseComponent } from './disease/disease.component';
import { GeneComponent } from './gene/gene.component';

const browserRoutes: Routes = [
  { path:'', component: MainSearchComponent},
  { path:'term', component: TermComponent },
  { path:'disease', component: DiseaseComponent},
  { path:'gene', component: GeneComponent }
]
export const browserRouting = RouterModule.forChild(browserRoutes)
@NgModule({
  imports: [
    RouterModule,
    browserRouting
  ],
 exports: [ RouterModule ]
})
export class BrowserRoutingModule {}
