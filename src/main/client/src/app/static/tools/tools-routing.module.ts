// Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { OverviewComponent } from './overview/overview.component';
import { PhenomizerComponent } from './phenomizer/phenomizer.component';
import { ExternalToolsComponent } from './external/external.component';
import { PhenogramVizComponent } from './phenogramviz/phenogramviz.component';
import { ExomiserComponent } from './exomiser/exomiser.component';
import { GenomiserComponent } from './genomiser/genomiser.component';
import { WorkbenchComponent } from './workbench/workbench.component';
import { ClinicalAnnotationComponent } from './clinicalannotation/clinicalanno.component';
import { OtherToolsComponent } from './other/other.component';
import {HpobrowserComponent} from "./hpobrowser/hpobrowser.component";

const toolsRoutes: Routes = [
  { path: 'tools',
    children: [
      { path: '', redirectTo: 'overview' },
      { path: 'overview',  component: OverviewComponent},
      { path: 'phenomizer', component: PhenomizerComponent},
      { path: 'phenogramviz', component: PhenogramVizComponent},
      { path: 'exomiser', component: ExomiserComponent},
      { path: 'genomiser', component: GenomiserComponent},
      { path: 'clinical-annotation', component: ClinicalAnnotationComponent},
      { path: 'other', component: OtherToolsComponent},
      { path: 'external', component: ExternalToolsComponent},
      { path: 'workbench', component: WorkbenchComponent},
      { path: 'hpo-browser', component: HpobrowserComponent}
    ]
  }
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
