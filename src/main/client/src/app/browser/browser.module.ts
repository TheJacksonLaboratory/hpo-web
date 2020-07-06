// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserRoutingModule } from './browser-routing.module';
// Material Modules
import { GlobalMaterialModules } from '../shared/modules/global.module';
// Services
import { SearchService } from '../shared/search/service/search.service';
import { TermService } from './services/term/term.service';
import { GeneService } from './services/gene/gene.service';
import { DiseaseService } from './services/disease/disease.service';
// Components
import { TermComponent } from './pages/term/term.component';
import { DiseaseComponent } from './pages/disease/disease.component';
import { GeneComponent } from './pages/gene/gene.component';
import { ExtrasModule } from '../shared/modules/extras.module';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { DialogExcelDownloadComponent } from '../shared/dialog-excel-download/dialog-excel-download.component';
import { DialogService } from '../shared/dialog-excel-download/dialog.service';
import { IntersectingComponent } from './pages/intersecting/intersecting.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserRoutingModule,
    GlobalMaterialModules,
    ExtrasModule

  ],
  providers: [ SearchService, TermService, GeneService, DiseaseService, DialogService ],
  declarations: [ TermComponent, DiseaseComponent,
    GeneComponent,
    SearchResultsComponent, DialogExcelDownloadComponent, IntersectingComponent ],
  entryComponents: [
    DialogExcelDownloadComponent
  ],
})
export class BrowserHPOModule { }
