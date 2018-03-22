 // Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './help/contact/contact.component';
import { CitationComponent } from './resources/citation/citation.component';
import { LicenseComponent } from './resources/license/license.component';
import { FaqComponent } from './resources/faq/faq.component';

const staticRoutes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'citation', component: CitationComponent },
  { path: 'contact', component: ContactComponent},
  { path: 'license', component: LicenseComponent },
  { path: 'faq', component: FaqComponent},
  { path: 'help', loadChildren: './help/help.module#HelpModule'},
  { path: 'downloads', loadChildren: './downloads/downloads.module#DownloadsModule' },
  { path: 'tools', loadChildren: './tools/tools.module#ToolsModule'}

];
export const staticRouting = RouterModule.forChild(staticRoutes);
@NgModule({
  imports: [
    RouterModule,
    staticRouting
  ],
  exports: [ RouterModule ]
})
export class StaticRoutingModule {}
