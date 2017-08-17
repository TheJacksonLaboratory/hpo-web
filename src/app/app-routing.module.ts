import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SearchHpoComponent } from './browser/search-hpo/search-hpo.component'


const appRoutes: Routes = [
  { path:'browser', component: SearchHpoComponent}
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: true} // debugging purposes only
    )
  ],
  exports:[RouterModule],
  bootstrap: []
})
export class RoutingModule {}
