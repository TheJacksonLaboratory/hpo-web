// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '../shared/pipes/translate.pipe';
import { BrowserRoutingModule } from './browser-routing.module';
// Material Modules
import { GlobalMaterialModules } from '../shared/modules/global.module';
// Services
import { SearchService } from '../shared/search/service/search.service';
import { AnnotationService } from './services/annotation/annotation.service';
import { GeneService } from './services/gene/gene.service';
import { OntologyService } from './services/ontology/ontology.service';
// Components
import { TermComponent } from './pages/term/term.component';
import { DiseaseComponent } from './pages/disease/disease.component';
import { GeneComponent } from './pages/gene/gene.component';
import { ExtrasModule } from '../shared/modules/extras.module';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { DialogExcelDownloadComponent } from '../shared/dialog-excel-download/dialog-excel-download.component';
import { DialogService } from '../shared/dialog-excel-download/dialog.service';
import { ProfileSearchComponent } from './pages/profile-search/profile-search.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserRoutingModule,
        GlobalMaterialModules,
        ExtrasModule
    ],
    providers: [SearchService, GeneService, DialogService,
        OntologyService, AnnotationService],
    declarations: [TermComponent, DiseaseComponent,
        GeneComponent,
        SearchResultsComponent, DialogExcelDownloadComponent, ProfileSearchComponent, TranslatePipe]
})
export class BrowserHPOModule {
}
