import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GlobalMaterialModules} from '../../shared/modules/global.module';
import {AnnotationFormatComponent} from './annotation-format/annotation-format.component';
import {LaypersonComponent} from './layperson/layperson.component';
import {TranslationComponent} from './translation/translation.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IndigenousComponent} from './indigenous/indigenous.component';
import {DataRoutingModule} from './data-routing.module';
import {AnnotationsDownloadComponent} from './annotations-download/annotations-download.component';
import {OntologyComponent} from './ontology/ontology.component';


@NgModule({
  imports: [
    CommonModule,
    DataRoutingModule,
    GlobalMaterialModules,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [AnnotationFormatComponent, AnnotationsDownloadComponent, TranslationComponent,
    IndigenousComponent, LaypersonComponent, OntologyComponent
  ]
})
export class DataModule {
}
