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
import { OtherComponent } from './other/other.component';
import { ClinicalAnnotationComponent } from './clinicalannotation/clinicalanno.component';
import { InternalToolsComponent } from './internaltools/internaltools.component';
import {ToolsComponent} from "./tools.component";

const toolsRoutes: Routes = [
  { path: 'tools',
    component: ToolsComponent,
    children: [
      { path: 'tools', redirectTo:'overview', pathMatch: 'prefix'},
      { path: 'overview',  component: OverviewComponent},
      { path: 'phenomizer', component: PhenomizerComponent},
      { path: 'phenogramviz', component: PhenogramVizComponent},
      { path: 'exomiser', component: ExomiserComponent},
      { path: 'genomiser', component: GenomiserComponent},
      { path: 'clinical-annotation', component: ClinicalAnnotationComponent},
      { path: 'internal', component: InternalToolsComponent},
      { path: 'external', component: ExternalToolsComponent},
      { path: 'other', component: OtherComponent}
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
