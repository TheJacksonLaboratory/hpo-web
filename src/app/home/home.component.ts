import { Component } from '@angular/core';

import { AnnouncementBannerComponent } from './announcement-banner/announcement-banner.component';
import { SearchSectionComponent } from './search-section/search-section.component';
import { ToolSectionComponent } from './tool-section/tool-section.component';
import { VideoSectionComponent } from './video-section/video-section.component';
import { PublicationSectionComponent } from './publication-section/publication-section.component';
import { ConnectSectionComponent } from './connect-section/connect-section.component';
import { ResourcesSectionComponent } from './resources-section/resources-section.component';
import { CitationSectionComponent } from './citation-section/citation-section.component';
import { FundingSectionComponent } from './funding-section/funding-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AnnouncementBannerComponent,
    SearchSectionComponent,
    ToolSectionComponent,
    VideoSectionComponent,
    PublicationSectionComponent,
    ConnectSectionComponent,
    ResourcesSectionComponent,
    CitationSectionComponent,
    FundingSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
