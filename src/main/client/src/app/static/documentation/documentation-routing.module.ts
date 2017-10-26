// Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { DocumentationComponent } from './documentation.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { AnnotationComponent } from './annotation/annotation.component';
import { DefinitionsComponent } from './definitions/definitions.component';

const documentationRoutes: Routes = [
  { path: '', component: DocumentationComponent},
  { path: 'intro', component: IntroductionComponent},
  { path: 'definitions', component: DefinitionsComponent },
  { path: 'annotations', component: AnnotationComponent}
];

export const documentationRouting = RouterModule.forChild(documentationRoutes)
@NgModule({
  imports: [
    RouterModule,
    documentationRouting
  ],
  exports: [ RouterModule ]
})
export class DocumentationRouting {}
