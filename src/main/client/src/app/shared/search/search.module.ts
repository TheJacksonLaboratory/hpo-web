import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { GlobalMaterialModules } from "../modules/global.module";
import { ExtrasModule } from "../modules/extras.module";
//Components
import { SearchbarComponent } from "./components/searchbar/searchbar.component";
import { SearchOutputComponent } from "./components/search.component";
//Service
import { SearchService } from "./service/search.service";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GlobalMaterialModules,
    RouterModule,
    ExtrasModule
  ],
  declarations: [SearchbarComponent, SearchOutputComponent],
  providers: [SearchService],
  exports: [SearchbarComponent, SearchOutputComponent ]
})
export class SearchModule { }
