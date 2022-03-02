// Modules
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// Components
import {AnnotationFormatComponent} from './annotation-format/annotation-format.component';
import {LaypersonComponent} from './layperson/layperson.component';
import {TranslationComponent} from './translation/translation.component';
import {AnnotationsDownloadComponent} from './annotations-download/annotations-download.component';
import {IndigenousComponent} from './indigenous/indigenous.component';
import {OntologyDownloadComponent} from './ontology-download/ontology-download.component';

const dataRoutes: Routes = [
  {
    path: 'data',
    children: [
      {path: 'annotations', component: AnnotationsDownloadComponent},
      {path: 'annotation-format', component: AnnotationFormatComponent},
      {path: 'ontology', component: OntologyDownloadComponent},
      {path: 'layperson', component: LaypersonComponent},
      {path: 'translations', component: TranslationComponent},
      {path: 'indigenous-languages', component: IndigenousComponent}
    ]
  },
];

export const dataRouting = RouterModule.forChild(dataRoutes);

@NgModule({
  imports: [
    RouterModule,
    dataRouting
  ],
  exports: [RouterModule]
})
export class DataRoutingModule {
}
