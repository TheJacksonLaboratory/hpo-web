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
import { SearchComponent } from './components/search/search.component';
import { TermComponent } from './components/term/term.component';
import { DiseaseComponent } from './components/disease/disease.component';
import { GeneComponent } from './components/gene/gene.component';
import { BrowserComponent } from './browser.component';
// Custom Pipes
import { SortPipe } from './pipes/sort-pipe';

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
  declarations: [ SearchComponent, TermComponent, DiseaseComponent, 
    GeneComponent, BrowserComponent, SortPipe ]
})
export class BrowserHPOModule { }
