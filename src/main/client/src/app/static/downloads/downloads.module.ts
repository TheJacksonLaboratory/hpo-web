import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalMaterialModules} from "../../shared/modules/global.module";
import {DownloadsRoutingModule} from "./downloads-routing.module";
// Components
import { DownloadsComponent } from "./downloads.component";
import { PhenotypeAnnotationComponent } from "./phenotype-annotation/phenotype-annotation.component";
import { HpOboComponent} from "./hp-obo/hp-obo.component";


@NgModule({
  imports: [
    CommonModule,
    DownloadsRoutingModule,
    GlobalMaterialModules
  ],
  declarations: [ DownloadsComponent, PhenotypeAnnotationComponent, HpOboComponent ]
})
export class DownloadsModule { }
