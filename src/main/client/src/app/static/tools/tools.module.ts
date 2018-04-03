import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolsRoutingModule } from "./tools-routing.module";

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


@NgModule({
  imports: [
    CommonModule,
    ToolsRoutingModule
  ],
  declarations: [ OverviewComponent, PhenomizerComponent, ExternalToolsComponent, PhenogramVizComponent,
    ExomiserComponent, GenomiserComponent, WorkbenchComponent, ClinicalAnnotationComponent, OtherToolsComponent ]
})
export class ToolsModule { }
