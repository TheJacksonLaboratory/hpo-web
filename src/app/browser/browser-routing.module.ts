// Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { MainSearchComponent } from './search/search.component'

const browserRoutes: Routes = [
  { path:'', component: MainSearchComponent}
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
