import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-no-page-found',
    imports: [CommonModule, RouterModule, MatButtonModule],
    templateUrl: './no-page-found.component.html',
    styleUrls: ['./no-page-found.component.css']
})
export class NoPageFoundComponent {
  pageTitle: string = 'Oops. Looks like something happened with your request.';
  errorMessage: string = 'Sorry, we could not find that page. Please ensure your URL is correct or the ' +
    'term you are looking for exists when searching.';
  errorFlag = false;

  constructor(private router: Router) {
    const routeConfig = this.router.getCurrentNavigation();
    if (routeConfig != null) {
      if (routeConfig.extras.state != null) {
        if (routeConfig.extras.state.description != null) {
          this.errorFlag = true;
          this.errorMessage = routeConfig.extras.state.description;
        }
      }
    }
  }
}
