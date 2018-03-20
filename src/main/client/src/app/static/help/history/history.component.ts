import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-definitions',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  pageTitle: String = "Help / History";
  pageIntro: String;
  constructor() {

   }
  ngOnInit() {
  }

}
