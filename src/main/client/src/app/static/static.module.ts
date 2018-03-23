// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaticRoutingModule } from './static-routing.module';

import { HelpModule } from './help/help.module';
import { DownloadsModule } from "./downloads/downloads.module";
import { ToolsModule } from "./tools/tools.module";
import { SearchModule } from "../shared/search/search.module";
// GlobalMaterialModules
import { GlobalMaterialModules} from "../shared/modules/global.module";
// Components
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './help/contact/contact.component';
import { CitationComponent } from './resources/citation/citation.component';
import { LicenseComponent } from './resources/license/license.component';
import { FaqComponent } from './resources/faq/faq.component';
// Pipe
import {SearchService} from "../shared/search/service/search.service";

@NgModule({
  imports: [
    CommonModule,
    StaticRoutingModule,
    HelpModule,
    DownloadsModule,
    ToolsModule,
    GlobalMaterialModules,
    SearchModule
  ],
  declarations: [ HomeComponent,
    ContactComponent, CitationComponent, LicenseComponent,
    FaqComponent
  ],
  providers:[SearchService]
})
export class StaticModule { }
