import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentationRouting } from './documentation-routing.module';
import { DocumentationComponent } from './documentation.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { AnnotationComponent } from './annotation/annotation.component';
import { DefinitionsComponent } from './definitions/definitions.component';

@NgModule({
  imports: [
    CommonModule,
    DocumentationRouting
  ],
  declarations: [DocumentationComponent, IntroductionComponent, AnnotationComponent, DefinitionsComponent]
})
export class DocumentationModule { }
