// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http'
import { BrowserRoutingModule } from './browser-routing.module'
// Services
import { PhenotypeService } from "./services/phenotype-service";
// Components
import { MainSearch } from './main-search/main-search.component';
import { SearchbarComponent } from './main-search/searchbar/searchbar.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    BrowserRoutingModule
  ],
  providers: [ PhenotypeService ],
  declarations: [ MainSearch, SearchbarComponent ]
})
export class BrowserHPOModule { }
