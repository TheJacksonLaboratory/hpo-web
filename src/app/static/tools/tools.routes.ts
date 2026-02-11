import { Routes } from '@angular/router';
import { PhenomizerComponent } from './phenomizer/phenomizer.component';
import { ExternalToolsComponent } from './external/external.component';
import { PhenogramVizComponent } from './phenogramviz/phenogramviz.component';
import { ExomiserComponent } from './exomiser/exomiser.component';
import { GenomiserComponent } from './genomiser/genomiser.component';
import { HpobrowserComponent } from './hpobrowser/hpobrowser.component';
import { LoincComponent } from './loinc/loinc.component';

export const toolsRoutes: Routes = [
  { path: 'phenomizer', component: PhenomizerComponent },
  { path: 'phenogramviz', component: PhenogramVizComponent },
  { path: 'exomiser', component: ExomiserComponent },
  { path: 'genomiser', component: GenomiserComponent },
  { path: 'external', component: ExternalToolsComponent },
  { path: 'hpo-browser', component: HpobrowserComponent },
  { path: 'loinc2hpo', component: LoincComponent }
];
