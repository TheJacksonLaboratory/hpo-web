import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-definitions',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  pageTitle: String;
  pageIntro: String;
  constructor() {
    this.pageTitle = "Documentaton / Computable HPO Term Definitions";
    this.pageIntro = "How do we define or compute our terms?";

   }
  ngOnInit() {
  }

}
