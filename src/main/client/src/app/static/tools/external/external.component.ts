import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-externalhpo',
  templateUrl: './external.component.html',
  styleUrls: ['./external.component.css']
})
export class ExternalToolsComponent implements OnInit {
  pageTitle: string = "Tools / External";
  pageIntro: String = "The HPO project welcomes other groups to use the HPO resources to develop tools and " +
    "algorithms. " + "This page has a list of academic and commercial tools that use the HPO. We invite feedback " +
    "about omissions or errors in this list. ";
  constructor() { }

  ngOnInit() {
  }

}
