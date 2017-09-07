// Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { HomeComponent } from './home/home.component';
import { ResourcesComponent } from './resources/resources.component';

const staticRoutes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'resources', component: ResourcesComponent}
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
