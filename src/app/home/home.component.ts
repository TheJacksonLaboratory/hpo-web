import { Component } from '@angular/core';

import { AnnouncementBannerComponent } from './announcement-banner/announcement-banner.component';
import { HeroBannerComponent } from './hero-banner/hero-banner.component';
import { ToolSectionComponent } from './tool-section/tool-section.component';
import { VideoSectionComponent } from './video-section/video-section.component';
import { PublicationSectionComponent } from './publication-section/publication-section.component';
import { ConnectSectionComponent } from './connect-section/connect-section.component';
import { ResourcesSectionComponent } from './resources-section/resources-section.component';
import { CitationSectionComponent } from './citation-section/citation-section.component';
import { FundingSectionComponent } from './funding-section/funding-section.component';
import { TrustedBySectionComponent } from './trusted-by-section/trusted-by-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AnnouncementBannerComponent,
    HeroBannerComponent,
    ToolSectionComponent,
    VideoSectionComponent,
    PublicationSectionComponent,
    ConnectSectionComponent,
    ResourcesSectionComponent,
    CitationSectionComponent,
    FundingSectionComponent,
    TrustedBySectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
