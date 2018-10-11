// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http'
import { BrowserRoutingModule } from './browser-routing.module'
//Material Modules
import {GlobalMaterialModules} from "../shared/modules/global.module";
// Services
import { SearchService } from '../shared/search/service/search.service';
import { TermService } from './services/term/term.service';
import { GeneService } from './services/gene/gene.service';
import { DiseaseService } from './services/disease/disease.service';
// Components
import { TermComponent } from './pages/term/term.component';
import { DiseaseComponent } from './pages/disease/disease.component';
import { GeneComponent } from './pages/gene/gene.component';
import {ExtrasModule} from "../shared/modules/extras.module";
import {SearchResultsComponent} from "./pages/search-results/search-results.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserRoutingModule,
    GlobalMaterialModules,
    ExtrasModule

  ],
  providers: [ SearchService, TermService, GeneService, DiseaseService ],
  declarations: [ TermComponent, DiseaseComponent,
    GeneComponent,
    SearchResultsComponent ]
})
export class BrowserHPOModule { }
