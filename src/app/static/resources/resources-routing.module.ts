import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ClinicianGuideComponent} from './clinician-guide/clinician-guide.component';
import {ContributingComponent} from './collaboration/contributing.component';
import {FaqComponent} from './faq/faq.component';
import {PublicationsComponent} from './publications/publications.component';
import { PhenopacketComponent } from './phenopacket/phenopacket.component';


const resourcesRoutes: Routes = [
  {
    path: 'resources',
    children: [
      {path: 'clinician-guide', component: ClinicianGuideComponent},
      {path: 'contributing', component: ContributingComponent},
      {path: 'faq', component: FaqComponent},
      {path: 'publications', component: PublicationsComponent},
      {path: 'phenopacket', component: PhenopacketComponent}
    ]
  },
];

export const resourcesRouting = RouterModule.forChild(resourcesRoutes);

@NgModule({
  imports: [
    RouterModule,
    resourcesRouting
  ],
  exports: [RouterModule]
})
export class ResourcesRoutingModule {
}
