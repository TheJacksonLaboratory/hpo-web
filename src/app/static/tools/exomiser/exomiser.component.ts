import { Component } from '@angular/core';

@Component({
    selector: 'app-exomiser',
    imports: [],
    templateUrl: './exomiser.component.html',
    styleUrls: ['./exomiser.component.css']
})
export class ExomiserComponent {
  pageTitle: string = "Tools / Exomiser";
  pageIntro: string = "";

  constructor() {
  }
}
