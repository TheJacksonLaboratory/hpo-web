import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


const appRoutes: Routes = [
  { path: '', redirectTo: 'hpo', pathMatch: 'full'},
  { path: 'hpo', loadChildren: './static/static.module#StaticModule'},
  { path: 'hpo/browser', loadChildren: './browser/browser.module#BrowserHPOModule'}
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
