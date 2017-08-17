import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-hpo',
  templateUrl: './search-hpo.component.html',
  styleUrls: ['./search-hpo.component.css']
})
export class SearchHpoComponent implements OnInit {
  title:String;

  constructor() { 
    this.title = "HPO Browser"
  }

  ngOnInit() {
  }

}
