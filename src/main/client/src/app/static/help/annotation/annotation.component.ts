import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.css']
})
export class AnnotationComponent implements OnInit {
  pageTitle: String = "Documentaton / Annotation - File Format";
  pageIntro: String = "Wondering how we annotate our terms or how we structure our files?";
  constructor() {
   }

  ngOnInit() {
  }

}
