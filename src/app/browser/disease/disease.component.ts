import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-disease',
  templateUrl: './disease.component.html',
  styleUrls: ['./disease.component.css']
})
export class DiseaseComponent implements OnInit {
  pageTitle: string;
  pageIntro: string;
  constructor() { 
    this.pageTitle = "Disease Anotation";
  }

  ngOnInit() {
  }

}
