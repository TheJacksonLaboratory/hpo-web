// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaticRoutingModule } from './static-routing.module';
import { DocumentationModule } from './documentation/documentation.module';
import { SearchModule } from "../shared/search/search.module";
// GlobalMaterialModules
import { GlobalMaterialModules} from "../shared/modules/global.module";
// Components
import { AboutComponent } from './about/about.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './resources/contact/contact.component';
import { CitationComponent } from './resources/citation/citation.component';
import { LicenseComponent } from './resources/license/license.component';
import { FaqComponent } from './resources/faq/faq.component';
// Pipe
import {SearchService} from "../shared/search/service/search.service";

@NgModule({
  imports: [
    CommonModule,
    StaticRoutingModule,
    DocumentationModule,
    GlobalMaterialModules,
    SearchModule
  ],
  providers:[SearchService],
  declarations: [ HomeComponent, DownloadsComponent, AboutComponent,
                  ContactComponent, CitationComponent, LicenseComponent,
                  FaqComponent]
})
export class StaticModule { }
