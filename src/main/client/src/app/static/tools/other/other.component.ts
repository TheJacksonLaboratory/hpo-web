import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css']
})
export class OtherComponent implements OnInit {
  pageTitle: string = "Tools / Other Tools";
  pageIntro: String = "";
  constructor() { }

  ngOnInit() {
  }

}
