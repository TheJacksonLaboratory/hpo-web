import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StaticRoutingModule} from './static-routing.module';
import {ToolsModule} from './tools/tools.module';
import {SearchModule} from '../shared/search/search.module';
import {GlobalMaterialModules} from '../shared/modules/global.module';
import {HomeComponent} from './home/home.component';
import {ContactComponent} from './resources/contact/contact.component';
import {CitationComponent} from './resources/citation/citation.component';
import {LicenseComponent} from './resources/license/license.component';
import {SearchService} from '../shared/search/service/search.service';
import {NewsComponent} from './news/news.component';
import {DisclaimerComponent} from './resources/disclaimer/disclaimer.component';
import {LoincComponent} from './tools/loinc/loinc.component';
import {AboutComponent} from './about/about.component';
import {TeamComponent} from './resources/team/team.component';
import {CommunityComponent} from './community/community.component';
import {FundingComponent} from './resources/funding/funding.component';
import {TeamService} from '../shared/team/team.service';
import {DataModule} from './data/data.module';
import {ResourcesModule} from './resources/resources.module';


@NgModule({
  imports: [
    CommonModule,
    DataModule,
    ToolsModule,
    ResourcesModule,
    GlobalMaterialModules,
    SearchModule,
    StaticRoutingModule
  ],
  declarations: [HomeComponent,
    ContactComponent, CitationComponent, LicenseComponent, NewsComponent, DisclaimerComponent,
    LoincComponent, AboutComponent, TeamComponent, CommunityComponent, FundingComponent
  ],
  providers: [SearchService, TeamService]
})
export class StaticModule {
}
