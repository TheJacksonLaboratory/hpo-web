import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class MainSearchComponent implements OnInit {
  pageTitle: String;
  pageIntro: String;
  activeSearch: boolean;
  constructor() {
    this.pageTitle = 'Human Phenotype Browser';
    this.pageIntro = '';
    this.activeSearch = false;
  }
  searchActive(state: boolean) {
    this.activeSearch = state;
  }
  ngOnInit() {
  }

}
