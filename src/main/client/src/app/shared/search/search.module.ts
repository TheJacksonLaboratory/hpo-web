import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { GlobalMaterialModules } from "../modules/global.module";
import { ExtrasModule } from "../modules/extras.module";
//Components
//Service
import { SearchService } from "./service/search.service";
import { SearchComponent } from './search/search.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GlobalMaterialModules,
    RouterModule,
    ExtrasModule
  ],
  declarations: [ SearchComponent ],
  providers: [SearchService],
  exports: [ SearchComponent ]
})
export class SearchModule { }
