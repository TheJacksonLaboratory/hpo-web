import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { GlobalMaterialModules } from "../modules/global.module";
import { ExtrasModule } from "../modules/extras.module";
//Components
//Service
import { SearchService } from "./service/search.service";
import { NewsearchComponent } from './newsearch/newsearch.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GlobalMaterialModules,
    RouterModule,
    ExtrasModule
  ],
  declarations: [ NewsearchComponent],
  providers: [SearchService],
  exports: [ NewsearchComponent ]
})
export class SearchModule { }
