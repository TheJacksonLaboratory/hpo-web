import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-citation',
  templateUrl: './citation.component.html',
  styleUrls: ['./citation.component.css']
})
export class CitationComponent implements OnInit {
  pageTitle: string;
  pageIntro: string;
  constructor() { 
    this.pageTitle = "Citation";
    this.pageIntro = " ";
  }
  ngOnInit() {
  }

}
