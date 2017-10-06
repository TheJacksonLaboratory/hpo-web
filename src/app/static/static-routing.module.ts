// Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { ContactComponent } from './resources/contact/contact.component';
import { CitationComponent } from './resources/citation/citation.component';
import { LicenseComponent } from './resources/license/license.component';
import { FaqComponent } from './resources/faq/faq.component';

const staticRoutes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'about', component: AboutComponent },
  { path: 'citation', component: CitationComponent },
  { path: 'contact', component: ContactComponent},
  { path: 'documentation', loadChildren: './documentation/documentation.module#DocumentationModule'},
  { path: 'downloads', component: DownloadsComponent },
  { path: 'license', component: LicenseComponent },
  { path: 'faq', component: FaqComponent}
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
