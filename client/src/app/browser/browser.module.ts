// Modules
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TranslatePipe } from '../shared/pipes/translate.pipe';
import {BrowserRoutingModule} from './browser-routing.module';
// Material Modules
import {GlobalMaterialModules} from '../shared/modules/global.module';
// Services
import {SearchService} from '../shared/search/service/search.service';
import {LanguageService} from './services/language/language.service';
import {TermService} from './services/term/term.service';
import {GeneService} from './services/gene/gene.service';
import {DiseaseService} from './services/disease/disease.service';
import {OntologyService} from './services/ontology/ontology.service';
// Components
import {TermComponent} from './pages/term/term.component';
import {DiseaseComponent} from './pages/disease/disease.component';
import {GeneComponent} from './pages/gene/gene.component';
import {ExtrasModule} from '../shared/modules/extras.module';
import {SearchResultsComponent} from './pages/search-results/search-results.component';
import {DialogExcelDownloadComponent} from '../shared/dialog-excel-download/dialog-excel-download.component';
import {DialogService} from '../shared/dialog-excel-download/dialog.service';
import {ProfileSearchComponent} from './pages/profile-search/profile-search.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserRoutingModule,
        GlobalMaterialModules,
        ExtrasModule
    ],
    providers: [SearchService, TermService, GeneService, DiseaseService, DialogService, OntologyService, LanguageService],
    declarations: [TermComponent, DiseaseComponent,
        GeneComponent,
        SearchResultsComponent, DialogExcelDownloadComponent, ProfileSearchComponent, TranslatePipe]
})
export class BrowserHPOModule {
}
