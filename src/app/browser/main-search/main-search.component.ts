import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-search',
  templateUrl: './main-search.component.html',
  styleUrls: ['./main-search.component.css']
})
export class MainSearch implements OnInit {
  title: String;
  activeSearch: boolean;
  constructor() {
    this.title = 'Human Phenotype Browser';
    this.activeSearch = false;
  }
  searchActive(state: boolean) {
    this.activeSearch = state;
  }
  ngOnInit() {
  }

}
