import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpRoutingModule } from './help-routing.module';
import { GlobalMaterialModules } from '../../shared/modules/global.module';
import { ContributorsService } from '../../shared/contributors/contributors.service';
// Components
import { AnnotationComponent} from './annotation/annotation.component';
import { ClinicianGuideComponent} from './clinician-guide/clinician-guide.component';
import { CollaborationComponent } from './collaboration/collaboration.component';
import { DefinitionsComponent } from './definitions/definitions.component';
import { HistoryComponent } from './history/history.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { LaypersonComponent } from './layperson/layperson.component';
import { MappingComponent } from './mapping/mapping.component';
import { UsersComponent} from './users/users.component';
import { ContributorsComponent } from './contributors/contributors.component';
import { PublicationsComponent } from './publications/publications.component';
import { FundingComponent } from './funding/funding.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndigenousComponent } from './indigenous/indigenous.component';


@NgModule({
  imports: [
    CommonModule,
    HelpRoutingModule,
    GlobalMaterialModules,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [AnnotationComponent, ClinicianGuideComponent, CollaborationComponent,
    DefinitionsComponent, HistoryComponent, IntroductionComponent, LaypersonComponent , MappingComponent,
    UsersComponent, ContributorsComponent, PublicationsComponent, FundingComponent, IndigenousComponent
    ],
  providers: [ContributorsService]
})
export class HelpModule { }
