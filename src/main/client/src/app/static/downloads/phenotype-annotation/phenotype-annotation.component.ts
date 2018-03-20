import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-phenotype-annotation',
  templateUrl: './phenotype-annotation.component.html',
  styleUrls: ['./phenotype-annotation.component.css']
})
export class PhenotypeAnnotationComponent implements OnInit {
  pageTitle: string = "Downloads / Phenotype-Annotation";
  pageIntro: String = "";
  constructor() { }

  ngOnInit() {
  }

}
