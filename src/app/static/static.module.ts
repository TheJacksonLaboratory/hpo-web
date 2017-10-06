// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaticRoutingModule } from './static-routing.module';
import { DocumentationModule } from './documentation/documentation.module';
// Angular Bootstrap Modules
import { MdTabsModule } from '@angular/material';
import { MdExpansionModule } from '@angular/material';
import { MdTableModule } from '@angular/material';
import { MdCardModule } from '@angular/material';
import { MdListModule } from '@angular/material';
import { MdButtonModule } from '@angular/material';
import { MdIconModule } from '@angular/material';

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
    MdTabsModule,
    MdExpansionModule,
    MdTableModule,
    MdCardModule,
    MdListModule,
    MdButtonModule,
    MdIconModule,
  ],
  declarations: [ HomeComponent, DownloadsComponent, AboutComponent,
                  ContactComponent, CitationComponent, LicenseComponent,
                  FaqComponent]
})
export class StaticModule { }
