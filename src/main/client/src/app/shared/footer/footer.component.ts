import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'footer-hpo',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  title:String;
  version:String;

  constructor() {
    this.title = "Human Phenotype Ontology"
    this.version =  "0.1"
   }

  ngOnInit() {
  }

}
