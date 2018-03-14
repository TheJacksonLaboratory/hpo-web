import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GlobalMaterialModules} from "../../shared/global.module";
import {DownloadsRoutingModule} from "./downloads-routing.module";
// Components
import { DownloadsComponent } from "./downloads.component";
import { PhenotypeAnnotationComponent } from "./phenotype-annotation/phenotype-annotation.component";
import { HpOboComponent} from "./hp-obo/hp-obo.component";
import { HpOwlComponent} from "./hp-owl/hp-owl.component";


@NgModule({
  imports: [
    CommonModule,
    DownloadsRoutingModule,
    GlobalMaterialModules
  ],
  declarations: [ DownloadsComponent, PhenotypeAnnotationComponent, HpOboComponent, HpOwlComponent ]
})
export class DownloadsModule { }
