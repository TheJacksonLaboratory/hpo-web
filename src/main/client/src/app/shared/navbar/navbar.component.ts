import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'navbar-hpo',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  title:string;
  
  constructor() {
    this.title = "Human Phenotype Ontology"
   }
  
  ngOnInit() {
  }

}
