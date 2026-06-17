import { Component } from '@angular/core';

import { AnnouncementBannerComponent } from './announcement-banner/announcement-banner.component';
import { HeroBannerComponent } from './hero-banner/hero-banner.component';
import { ToolSectionComponent } from './tool-section/tool-section.component';
import { VideoSectionComponent } from './video-section/video-section.component';
import { PublicationSectionComponent } from './publication-section/publication-section.component';
import { ResourcesSectionComponent } from './resources-section/resources-section.component';
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
    ResourcesSectionComponent,
    TrustedBySectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
