// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaticRoutingModule } from './static-routing.module';
import { DocumentationModule } from './documentation/documentation.module';
// Angular Bootstrap Modules
import { MatTabsModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material';
import { MatTableModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
import { MatListModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatIconModule } from '@angular/material';

// Components
import { AboutComponent } from './about/about.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './resources/contact/contact.component';
import { CitationComponent } from './resources/citation/citation.component';
import { LicenseComponent } from './resources/license/license.component';
import { FaqComponent } from './resources/faq/faq.component';

@NgModule({
  imports: [
    CommonModule,
    StaticRoutingModule,
    DocumentationModule,
    MatTabsModule,
    MatExpansionModule,
    MatTableModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
  ],
  declarations: [ HomeComponent, DownloadsComponent, AboutComponent,
                  ContactComponent, CitationComponent, LicenseComponent,
                  FaqComponent]
})
export class StaticModule { }
