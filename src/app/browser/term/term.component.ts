import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})
export class TermComponent implements OnInit {
  pageTitle: String;
  pageIntro: String;
  constructor() { 
    this.pageTitle = "Ontology Term";
  }

  ngOnInit() {
  }

}
