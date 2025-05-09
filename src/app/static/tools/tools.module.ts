import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToolsRoutingModule} from './tools-routing.module';

// Components
import {PhenomizerComponent} from './phenomizer/phenomizer.component';
import {ExternalToolsComponent} from './external/external.component';
import {PhenogramVizComponent} from './phenogramviz/phenogramviz.component';
import {ExomiserComponent} from './exomiser/exomiser.component';
import {GenomiserComponent} from './genomiser/genomiser.component';
import {HpobrowserComponent} from './hpobrowser/hpobrowser.component';
import {GlobalMaterialModules} from "../../shared/modules/global.module";


@NgModule({
  imports: [
    CommonModule,
    ToolsRoutingModule,
    GlobalMaterialModules
  ],
  declarations: [PhenomizerComponent, ExternalToolsComponent, PhenogramVizComponent,
    ExomiserComponent, GenomiserComponent, HpobrowserComponent]
})
export class ToolsModule {
}
