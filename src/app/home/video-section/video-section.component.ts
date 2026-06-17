import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-section',
  standalone: true,
  templateUrl: './video-section.component.html',
  styleUrl: './video-section.component.scss',
})
export class VideoSectionComponent {
  readonly videoUrl: SafeResourceUrl;

  constructor(sanitizer: DomSanitizer) {
    this.videoUrl = sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/gjLVph13p6Y'
    );
  }
}
