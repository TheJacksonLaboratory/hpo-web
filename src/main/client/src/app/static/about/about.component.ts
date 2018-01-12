import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  pageTitle: String;
  pageIntro: String;
  constructor() { 
    this.pageTitle = "About";
    this.pageIntro = "Welcome to Human Phenotype Ontology. You can find more about us below, and if you have any questions feel free to contact us by selecting contact in the footer or \
                      by visiting the resources page.";
  }
  ngOnInit() {
  }

}
