import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MainSearch } from './browser/main-search/main-search.component'


const appRoutes: Routes = [
  { path:'browser', component: MainSearch}
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
