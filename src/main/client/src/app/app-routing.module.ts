import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NoPageFoundComponent } from './error/no-page-found.component';


export const appRoutes: Routes = [
  { path: '', pathMatch: 'prefix', loadChildren: './static/static.module#StaticModule'},
  { path: 'browse', loadChildren: './browser/browser.module#BrowserHPOModule'},
  { path: '**', component: NoPageFoundComponent}

];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false} // debugging purposes only
    )
  ],
  exports: [RouterModule],
  bootstrap: []
})
export class RoutingModule {}
