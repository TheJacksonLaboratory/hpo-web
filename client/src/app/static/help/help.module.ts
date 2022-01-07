import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HelpRoutingModule} from './help-routing.module';
import {GlobalMaterialModules} from '../../shared/modules/global.module';
import {TeamService} from '../../shared/team/team.service';
import {AnnotationComponent} from './annotation/annotation.component';
import {ClinicianGuideComponent} from './clinician-guide/clinician-guide.component';
import {CollaborationComponent} from './collaboration/collaboration.component';
import {DefinitionsComponent} from './definitions/definitions.component';
import {IntroductionComponent} from './introduction/introduction.component';
import {LaypersonComponent} from './layperson/layperson.component';
import {MappingComponent} from './mapping/mapping.component';
import {UsersComponent} from './users/users.component';
import {TeamComponent} from './team/team.component';
import {PublicationsComponent} from './publications/publications.component';
import {FundingComponent} from './funding/funding.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IndigenousComponent} from './indigenous/indigenous.component';


@NgModule({
  imports: [
    CommonModule,
    HelpRoutingModule,
    GlobalMaterialModules,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [AnnotationComponent, ClinicianGuideComponent, CollaborationComponent,
    DefinitionsComponent, IntroductionComponent, LaypersonComponent, MappingComponent,
    UsersComponent, TeamComponent, PublicationsComponent, FundingComponent, IndigenousComponent
  ],
  providers: [TeamService]
})
export class HelpModule {
}
