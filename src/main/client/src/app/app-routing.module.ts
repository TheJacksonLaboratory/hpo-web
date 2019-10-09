import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NoPageFoundComponent } from './error/no-page-found.component';


export const appRoutes: Routes = [
  { path: '', pathMatch: 'prefix', loadChildren: () => import('./static/static.module').then(m => m.StaticModule)},
  { path: 'browse', loadChildren: () => import('./browser/browser.module').then(m => m.BrowserHPOModule)},
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
