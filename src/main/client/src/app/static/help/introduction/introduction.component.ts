import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})
export class IntroductionComponent implements OnInit {
  pageTitle: String = "Documentation / Introduction";
  pageIntro: String = "An introuction to the Human Phenotype Ontology";
  constructor() {
  }
  ngOnInit() {
  }

}
