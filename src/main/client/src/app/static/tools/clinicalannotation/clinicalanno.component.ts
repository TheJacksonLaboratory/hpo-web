import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clinicalanno',
  templateUrl: './clinicalanno.component.html',
  styleUrls: ['./clinicalanno.component.css']
})
export class ClinicalAnnotationComponent implements OnInit {
  pageTitle: string = "Tools / Clinical-Annotation";
  pageIntro: String = "";
  constructor() { }

  ngOnInit() {
  }

}
