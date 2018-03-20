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
    this.pageTitle = "Help / Users";
    this.pageIntro = "Who else is using the Ontology?";

   }
  ngOnInit() {
  }

}
