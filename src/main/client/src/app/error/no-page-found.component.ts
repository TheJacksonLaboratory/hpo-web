import { Component } from '@angular/core';

@Component({
  selector: 'app-no-page-found',
  templateUrl: './no-page-found.component.html',
  styleUrls: ['./no-page-found.component.css']
})
export class NoPageFoundComponent {
  pageTitle: String;
  pageIntro: String;
  constructor() {
    this.pageTitle = 'Error. No Page Found.';
    this.pageIntro = 'Sorry, we could not find that page. Please ensure your URL is correct.';

  }
}
