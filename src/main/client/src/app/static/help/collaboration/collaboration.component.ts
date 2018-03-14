import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-definitions',
  templateUrl: './collaboration.component.html',
  styleUrls: ['./collaboration.component.css']
})
export class CollaborationComponent implements OnInit {
  pageTitle: String;
  pageIntro: String;
  constructor() {
    this.pageTitle = "Documentaton / Computable HPO Term Definitions";
    this.pageIntro = "How do we define or compute our terms?";

   }
  ngOnInit() {
  }

}
