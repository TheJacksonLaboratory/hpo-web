import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {
  private formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfID5F6is5J7GSJUlFzIYZ7FOsXEebjLjLZwXhLdFPELVBVMQ/viewform?usp=dialog';
  safeFormUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.safeFormUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.formUrl);
  }
}
