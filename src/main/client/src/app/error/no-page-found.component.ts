import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-page-found',
  templateUrl: './no-page-found.component.html',
  styleUrls: ['./no-page-found.component.css']
})
export class NoPageFoundComponent {
  pageTitle: String = 'Oops. Looks like something happened with your request.';
  errorMessage: String = 'Sorry, we could not find that page. Please ensure your URL is correct or the ' +
  'term you are looking for exists when searching.';
  errorFlag = false;

  constructor(private router: Router) {
    const routeConfig = this.router.getCurrentNavigation().extras.state;
    if (routeConfig != null) {
      if (routeConfig.description != null) {
         this.errorFlag = true;
         this.errorMessage = routeConfig.description;
      }
    }
  }
}
