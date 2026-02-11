import { Routes } from '@angular/router';
import { FaqComponent } from './faq/faq.component';
import { PublicationsComponent } from './publications/publications.component';

export const resourcesRoutes: Routes = [
  { path: 'faq', component: FaqComponent },
  { path: 'publications', component: PublicationsComponent }
];
