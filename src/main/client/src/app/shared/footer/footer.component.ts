import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'footer-hpo',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  title: string;
  version: string;

  constructor() {
    this.title = 'Human Phenotype Ontology';
   }

  ngOnInit() {
  }

}
