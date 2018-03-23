import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-externalhpo',
  templateUrl: './externalhpo.component.html',
  styleUrls: ['./externalhpo.component.css']
})
export class ExternalHPOComponent implements OnInit {
  pageTitle: string = "Tools / External Tools";
  pageIntro: String = "";
  constructor() { }

  ngOnInit() {
  }

}
