import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-definitions',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})
export class MappingComponent implements OnInit {
  pageTitle: String = "Help / Mapping and Translation";
  pageIntro: String = "";
  constructor() {

   }
  ngOnInit() {
  }

}
