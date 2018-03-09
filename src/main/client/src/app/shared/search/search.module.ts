import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { GlobalMaterialModules } from "../global.module";
//Components
import { SearchbarComponent } from "./components/searchbar/searchbar.component";
import { SearchOutputComponent } from "./components/search.component";
import { HighlightPipe } from "../pipes/highlight.pipe";
//Service
import { SearchService } from "./service/search.service";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GlobalMaterialModules,
    RouterModule
  ],
  declarations: [SearchbarComponent, SearchOutputComponent, HighlightPipe],
  providers: [SearchService],
  exports: [SearchbarComponent, SearchOutputComponent ]
})
export class SearchModule { }
