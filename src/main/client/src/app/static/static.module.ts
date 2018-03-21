// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaticRoutingModule } from './static-routing.module';
import { HelpModule } from './help/help.module';
import { DownloadsModule } from "./downloads/downloads.module";
import { ToolsModule } from "./tools/tools.module";
// GlobalMaterialModules
import { GlobalMaterialModules} from "../shared/global.module";
// Components
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './help/contact/contact.component';
import { CitationComponent } from './resources/citation/citation.component';
import { LicenseComponent } from './resources/license/license.component';
import { FaqComponent } from './resources/faq/faq.component';

@NgModule({
  imports: [
    CommonModule,
    StaticRoutingModule,
    HelpModule,
    DownloadsModule,
    ToolsModule,
    GlobalMaterialModules
  ],
  declarations: [ HomeComponent,
                  ContactComponent, CitationComponent, LicenseComponent,
                  FaqComponent ]
})
export class StaticModule { }
