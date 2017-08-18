import { Component, OnInit } from '@angular/core';
import { SearchbarComponent } from './searchbar/searchbar.component'
@Component({
  selector: 'app-main-search',
  templateUrl: './main-search.component.html',
  styleUrls: ['./main-search.component.css']
})
export class MainSearch implements OnInit {
  title:String;

  constructor() { 
    this.title = "Human Phenotype Browser"
  }

  ngOnInit() {
  }

}
