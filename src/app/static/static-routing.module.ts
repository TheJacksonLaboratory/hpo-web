// Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './resources/contact/contact.component';
import { CitationComponent } from './resources/citation/citation.component';
import { LicenseComponent } from './resources/license/license.component';
import { FaqComponent } from './resources/faq/faq.component';
import { NewsComponent } from './news/news.component';
import { DisclaimerComponent } from './resources/disclaimer/disclaimer.component';
import { AboutComponent } from './about/about.component';
import { FundingComponent } from './resources/funding/funding.component';
import { FeedbackComponent } from './feedback/feedback.component';

const staticRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'citation', component: CitationComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'license', component: LicenseComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'faq/:id', component: FaqComponent },
  { path: 'news', component: NewsComponent },
  { path: 'news/:id', component: NewsComponent },
  { path: 'funding', component: FundingComponent },
  { path: 'data', loadChildren: () => import('./data/data.module').then(m => m.DataModule) },
  { path: 'resources', loadChildren: () => import('./resources/resources.module').then(m => m.ResourcesModule) },
  { path: 'tools', loadChildren: () => import('./tools/tools.module').then(m => m.ToolsModule) },
  { path: 'disclaimer', component: DisclaimerComponent },
  { path: 'feedback', component: FeedbackComponent }
];

export const staticRouting = RouterModule.forChild(staticRoutes);

@NgModule({
  imports: [
    RouterModule,
    staticRouting
  ],
  exports: [RouterModule]
})
export class StaticRoutingModule {}
