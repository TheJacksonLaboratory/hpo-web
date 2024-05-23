import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
