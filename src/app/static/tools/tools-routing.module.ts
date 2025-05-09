// Modules
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// Components
import {PhenomizerComponent} from './phenomizer/phenomizer.component';
import {ExternalToolsComponent} from './external/external.component';
import {PhenogramVizComponent} from './phenogramviz/phenogramviz.component';
import {ExomiserComponent} from './exomiser/exomiser.component';
import {GenomiserComponent} from './genomiser/genomiser.component';
import {HpobrowserComponent} from './hpobrowser/hpobrowser.component';
import {LoincComponent} from './loinc/loinc.component';

const toolsRoutes: Routes = [
  {
    path: 'tools',
    children: [
      {path: 'phenomizer', component: PhenomizerComponent},
      {path: 'phenogramviz', component: PhenogramVizComponent},
      {path: 'exomiser', component: ExomiserComponent},
      {path: 'genomiser', component: GenomiserComponent},
      {path: 'external', component: ExternalToolsComponent},
      {path: 'hpo-browser', component: HpobrowserComponent},
      {path: 'loinc2hpo', component: LoincComponent}
    ]
  }
];

export const toolsRouting = RouterModule.forChild(toolsRoutes);

@NgModule({
  imports: [
    RouterModule,
    toolsRouting
  ],
  exports: [RouterModule]
})
export class ToolsRoutingModule {
}
