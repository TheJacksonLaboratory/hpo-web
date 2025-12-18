import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaqComponent } from './faq/faq.component';
import { PublicationsComponent } from './publications/publications.component';


const resourcesRoutes: Routes = [
  {
    path: 'resources',
    children: [
      { path: 'faq', component: FaqComponent },
      { path: 'publications', component: PublicationsComponent }
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
