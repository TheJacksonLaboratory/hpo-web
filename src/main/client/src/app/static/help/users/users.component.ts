import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-definitions',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  pageTitle: String = "Help / Users";
  pageIntro: String = "Who else is using the Ontology?";
  constructor() {

   }
  ngOnInit() {
  }

}
