// Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { TermComponent } from './components/term/term.component';
import { DiseaseComponent } from './components/disease/disease.component';
import { GeneComponent } from './components/gene/gene.component';
import { BrowserComponent } from './browser.component';

const browserRoutes: Routes = [
  { path:'', component: BrowserComponent, 
    children:[
      { path:'term/:id', component: TermComponent },
      { path:'disease', component: DiseaseComponent},
      { path:'gene', component: GeneComponent }
    ]
  }
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
