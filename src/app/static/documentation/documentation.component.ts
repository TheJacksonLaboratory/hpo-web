import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit {
  pageTitle: String;
  pageIntro: String;
  constructor() { 
    this.pageTitle = "Documentation";
    this.pageIntro = "This documenation provides structure to find what you're looking for quickly.";
  }

  ngOnInit() {
  }

}
