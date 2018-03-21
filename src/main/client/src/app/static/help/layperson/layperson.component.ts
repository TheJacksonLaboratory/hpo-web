import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layperson',
  templateUrl: './layperson.component.html',
  styleUrls: ['./layperson.component.css']
})
export class LaypersonComponent implements OnInit {
  pageTitle: String = "Help / Layperson";
  pageIntro: String = "";
  constructor() { }

  ngOnInit() {
  }

}
