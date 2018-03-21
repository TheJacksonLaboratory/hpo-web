// Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { DownloadsComponent } from "./downloads.component";
import { PhenotypeAnnotationComponent } from "./phenotype-annotation/phenotype-annotation.component";
import { HpOboComponent} from "./hp-obo/hp-obo.component";

const downloadRoutes: Routes = [
  { path: '', component: DownloadsComponent},
  { path: 'hpobo', component: HpOboComponent},
  { path: 'phenotype-annotation', component: PhenotypeAnnotationComponent}

];
export const downloadsRouting = RouterModule.forChild(downloadRoutes);
@NgModule({
  imports: [
    RouterModule,
    downloadsRouting
  ],
  exports: [ RouterModule ]
})
export class DownloadsRoutingModule {}
