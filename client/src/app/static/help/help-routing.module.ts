// Modules
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// Components
import {AnnotationComponent} from './annotation/annotation.component';
import {ClinicianGuideComponent} from './clinician-guide/clinician-guide.component';
import {CollaborationComponent} from './collaboration/collaboration.component';
import {DefinitionsComponent} from './definitions/definitions.component';
import {HistoryComponent} from './history/history.component';
import {IntroductionComponent} from './introduction/introduction.component';
import {LaypersonComponent} from './layperson/layperson.component';
import {MappingComponent} from './mapping/mapping.component';
import {UsersComponent} from './users/users.component';
import {ContributorsComponent} from './contributors/contributors.component';
import {PublicationsComponent} from './publications/publications.component';
import {FundingComponent} from './funding/funding.component';
import {IndigenousComponent} from './indigenous/indigenous.component';

const helpRoutes: Routes = [
  {
    path: 'help',
    children: [
      {path: '', redirectTo: 'introduction'},
      {path: 'annotations', component: AnnotationComponent},
      {path: 'clinician-guide', component: ClinicianGuideComponent},
      {path: 'collaboration', component: CollaborationComponent},
      {path: 'definitions', component: DefinitionsComponent},
      {path: 'history', component: HistoryComponent},
      {path: 'introduction', component: IntroductionComponent},
      {path: 'layperson', component: LaypersonComponent},
      {path: 'translations', component: MappingComponent},
      {path: 'indigenous-languages', component: IndigenousComponent},
      {path: 'users', component: UsersComponent},
      {path: 'contributors', component: ContributorsComponent},
      {path: 'publications', component: PublicationsComponent},
      {path: 'funding', component: FundingComponent}
    ]
  },

];

export const helpRouting = RouterModule.forChild(helpRoutes);

@NgModule({
  imports: [
    RouterModule,
    helpRouting
  ],
  exports: [RouterModule]
})
export class HelpRoutingModule {
}
