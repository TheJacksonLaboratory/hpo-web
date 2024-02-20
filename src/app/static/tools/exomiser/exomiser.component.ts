import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-exomiser',
  templateUrl: './exomiser.component.html',
  styleUrls: ['./exomiser.component.css']
})
export class ExomiserComponent {
  pageTitle: string = "Tools / Exomiser";
  pageIntro: String = "";

  constructor() {
  }
}
