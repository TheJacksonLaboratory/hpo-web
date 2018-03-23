import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpRoutingModule } from './help-routing.module';

// Components
import { HelpComponent } from './help.component';
import { AnnotationComponent} from "./annotation/annotation.component";
import { ClinicianGuideComponent} from "./clinician-guide/clinician-guide.component";
import { CollaborationComponent } from "./collaboration/collaboration.component";
import { DefinitionsComponent } from './definitions/definitions.component';
import { HistoryComponent } from './history/history.component'
import { IntroductionComponent } from './introduction/introduction.component';
import { LaypersonComponent } from './layperson/layperson.component';
import { MappingComponent } from './mapping/mapping.component';
import { UsersComponent} from "./users/users.component";


@NgModule({
  imports: [
    CommonModule,
    HelpRoutingModule
  ],
  declarations: [HelpComponent, AnnotationComponent, ClinicianGuideComponent, CollaborationComponent,
    DefinitionsComponent, HistoryComponent, IntroductionComponent, LaypersonComponent , MappingComponent, UsersComponent
    ]
})
export class HelpModule { }
