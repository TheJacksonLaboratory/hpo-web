import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Meta } from '@angular/platform-browser';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { FloatingFeedbackComponent } from './shared/floating-feedback/floating-feedback.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    NavbarComponent,
    FooterComponent,
    FloatingFeedbackComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  mobileNavSection = 'home';
  parentSections = [];

  constructor(meta: Meta) {
    if (!environment.production) {
      meta.addTag({ name: 'robots', content: 'noindex' });
    }
  }

  backNavigate() {
    this.mobileNavSection = this.parentSections.pop();
  }

  mobileNavigate(dest: string) {
    this.parentSections.push(this.mobileNavSection);
    this.mobileNavSection = dest;
  }

}
