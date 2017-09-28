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
import { TermService } from './services/term-service';
// Components
import { MainSearchComponent } from './search/search.component';
import { SearchbarComponent } from './search/searchbar/searchbar.component';

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
  providers: [ TermService ],
  declarations: [ MainSearchComponent, SearchbarComponent ]
})
export class BrowserHPOModule { }
