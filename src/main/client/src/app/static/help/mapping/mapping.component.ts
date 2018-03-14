import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-definitions',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})
export class MappingComponent implements OnInit {
  pageTitle: String;
  pageIntro: String;
  constructor() {
    this.pageTitle = "Documentaton / Computable HPO Term Definitions";
    this.pageIntro = "How do we define or compute our terms?";

   }
  ngOnInit() {
  }

}
