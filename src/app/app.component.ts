import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { Meta } from '@angular/platform-browser';

import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { FloatingFeedbackComponent } from './shared/floating-feedback/floating-feedback.component';
import { environment } from '../environments/environment';

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
    if (!environment.production) {
      meta.addTag({ name: 'robots', content: 'noindex' });
    }
  }
}
