import {Component, EventEmitter, OnInit} from '@angular/core';
import {OutputEmitter} from "@angular/compiler/src/output/abstract_emitter";
import {Output} from "@angular/core";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  clearSearch: boolean = false;
  searchString: string;
  constructor() { }

  ngOnInit() {
  }
  setOverlay(event: Event){
    if(this.searchString){
      this.clearSearch = true;
    }else{
      this.clearSearch = false;
    }
  }
}
