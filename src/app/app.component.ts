import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { FloatingFeedbackComponent } from './shared/floating-feedback/floating-feedback.component';

@Component({
    selector: 'app-root',
    imports: [
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

  constructor() {
  }

  backNavigate() {
    this.mobileNavSection = this.parentSections.pop();
  }

  mobileNavigate(dest: string) {
    this.parentSections.push(this.mobileNavSection);
    this.mobileNavSection = dest;
  }

}
