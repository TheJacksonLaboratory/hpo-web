import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.css']
})
export class DownloadsComponent implements OnInit {
  pageTitle: String;
  pageIntro: String;
  constructor() { 
    this.pageTitle = "Downloads";
    this.pageIntro = "Human Phenotype Ontology offers complete (and free) downloads of the ontology, annotation files, and the database.";
  }

  ngOnInit() {
  }

}
