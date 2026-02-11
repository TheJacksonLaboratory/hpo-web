import { Component } from '@angular/core';

@Component({
  selector: 'app-exomiser',
  standalone: true,
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
