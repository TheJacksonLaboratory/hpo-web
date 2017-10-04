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
import { SearchService } from './services/search/search.service';
import { TermService } from './services/term/term.service';
// Components
import { SearchComponent } from './search/search.component';
import { TermComponent } from './term/term.component';
import { DiseaseComponent } from './disease/disease.component';
import { GeneComponent } from './gene/gene.component';
import { BrowserComponent } from './browser.component';

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
  providers: [ SearchService, TermService ],
  declarations: [ SearchComponent,TermComponent, DiseaseComponent, GeneComponent, BrowserComponent ]
})
export class BrowserHPOModule { }
