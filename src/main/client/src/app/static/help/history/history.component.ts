import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-definitions',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  pageTitle: String;
  pageIntro: String;
  constructor() {
    this.pageTitle = "Documentaton / Computable HPO Term Definitions";
    this.pageIntro = "How do we define or compute our terms?";

   }
  ngOnInit() {
  }

}
