import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-phenogramviz',
  templateUrl: './phenogramviz.component.html',
  styleUrls: ['./phenogramviz.component.css']
})
export class PhenogramVizComponent implements OnInit {
  pageTitle: string = "Tools / PhenoGramViz";
  pageIntro: String = "";
  constructor() { }

  ngOnInit() {
  }

}
