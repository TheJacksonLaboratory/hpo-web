// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http'
import { BrowserRoutingModule } from './browser-routing.module'
import { MdInputModule } from '@angular/material';
import { MdCardModule } from '@angular/material';
import { MdIconModule } from '@angular/material';
// Services
import { PhenotypeService } from "./services/phenotype-service";
// Components
import { MainSearch } from './search/search.component';
import { SearchbarTAComponent } from './search/searchbar-ta/searchbar-ta.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    BrowserRoutingModule,
    MdInputModule,
    MdCardModule,
    MdIconModule
  ],
  providers: [ PhenotypeService ],
  declarations: [ MainSearch, SearchbarTAComponent ]
})
export class BrowserHPOModule { }
