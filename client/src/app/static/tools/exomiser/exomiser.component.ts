import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-exomiser',
  templateUrl: './exomiser.component.html',
  styleUrls: ['./exomiser.component.css']
})
export class ExomiserComponent implements OnInit {
  pageTitle: string = "Tools / Exomiser";
  pageIntro: String = "";

  constructor() {
  }

  ngOnInit() {
  }

}
