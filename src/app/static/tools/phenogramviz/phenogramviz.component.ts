import { Component } from '@angular/core';

@Component({
  selector: 'app-phenogramviz',
  standalone: true,
  imports: [],
  templateUrl: './phenogramviz.component.html',
  styleUrls: ['./phenogramviz.component.css']
})
export class PhenogramVizComponent {
  pageTitle: string = "Tools / PhenoGramViz";
  pageIntro: string = "";

  constructor() {
  }

}
