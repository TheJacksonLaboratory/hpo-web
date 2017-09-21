// Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { ResourcesComponent } from './resources/resources.component';
import { DownloadsComponent } from './downloads/downloads.component';

const staticRoutes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'resources', component: ResourcesComponent },
  { path: 'downloads', component: DownloadsComponent },
  { path: 'documentation', loadChildren: './documentation/documentation.module#DocumentationModule'},
  { path: 'about', component: AboutComponent }
]
export const staticRouting = RouterModule.forChild(staticRoutes)
@NgModule({
  imports: [
    RouterModule,
    staticRouting
  ],
  exports: [ RouterModule ]
})
export class StaticRoutingModule {}
