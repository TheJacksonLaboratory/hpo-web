// Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { OverviewComponent } from './overview/overview.component';
import { PhenomizerComponent } from './phenomizer/phenomizer.component';
import { ExternalHPOComponent } from './externalhpo/externalhpo.component';
import { PhenogramVizComponent } from './phenogramviz/phenogramviz.component';
import { ExomiserComponent } from './exomiser/exomiser.component';
import { GenomiserComponent } from './genomiser/genomiser.component';
import { OtherComponent } from './other/other.component';
import { ClinicalAnnotationComponent } from './clinicalannotation/clinicalanno.component';
import { InternalToolsComponent } from './internaltools/internaltools.component';

const toolsRoutes: Routes = [
  { path: '', component: OverviewComponent},
  { path: 'phenomizer', component: PhenomizerComponent},
  { path: 'phenogramviz', component: PhenogramVizComponent},
  { path: 'exomiser', component: ExomiserComponent},
  { path: 'genomiser', component: GenomiserComponent},
  { path: 'clinical-annotation', component: ClinicalAnnotationComponent},
  { path: 'internal-tools', component: InternalToolsComponent},
  { path: 'external', component:  ExternalHPOComponent},
  { path: 'other', component: OtherComponent}
];

export const toolsRouting = RouterModule.forChild(toolsRoutes);
@NgModule({
  imports: [
    RouterModule,
    toolsRouting
  ],
  exports: [ RouterModule ]
})
export class ToolsRoutingModule {}
