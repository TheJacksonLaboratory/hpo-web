import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolsRoutingModule } from "./tools-routing.module";

// Components
import { PhenomizerComponent } from './phenomizer/phenomizer.component';
import { ExternalToolsComponent } from './external/external.component';
import { PhenogramVizComponent } from './phenogramviz/phenogramviz.component';
import { ExomiserComponent } from './exomiser/exomiser.component';
import { GenomiserComponent } from './genomiser/genomiser.component';
import { WorkbenchComponent } from './workbench/workbench.component';
import { HpobrowserComponent } from './hpobrowser/hpobrowser.component';


@NgModule({
  imports: [
    CommonModule,
    ToolsRoutingModule
  ],
  declarations: [PhenomizerComponent, ExternalToolsComponent, PhenogramVizComponent,
    ExomiserComponent, GenomiserComponent, WorkbenchComponent, HpobrowserComponent ]
})
export class ToolsModule { }
