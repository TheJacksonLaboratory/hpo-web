// Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { MainSearch } from './main-search/main-search.component'

const browserRoutes: Routes = [
  { path:'', component: MainSearch}
]
export const browserRouting = RouterModule.forChild(browserRoutes)
@NgModule({
  imports: [
    RouterModule,
    browserRouting
  ],
 exports: [ RouterModule ]
})
export class BrowserRoutingModule {}
