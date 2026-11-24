import { Component, inject } from '@angular/core';

import { RouterModule } from '@angular/router';
import { Meta } from '@angular/platform-browser';

import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FloatingFeedbackComponent } from './layout/floating-feedback/floating-feedback.component';
import { environment } from '../environments/environment';
import { SessionHistoryService } from './browser/services/session-history/session-history.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    NavbarComponent,
    FooterComponent,
    FloatingFeedbackComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(meta: Meta) {
    inject(SessionHistoryService);
    if (!environment.production) {
      meta.addTag({ name: 'robots', content: 'noindex' });
    }
  }
}
