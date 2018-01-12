import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})
export class IntroductionComponent implements OnInit {
  pageTitle: String;
  pageIntro: String;
  constructor() { 
    this.pageTitle = "Documentation / Introduction";
    this.pageIntro = "An introuction to the Human Phenotype Ontology";
  }
  ngOnInit() {
  }

}
