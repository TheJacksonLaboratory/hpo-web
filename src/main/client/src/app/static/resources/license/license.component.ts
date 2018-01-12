import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.css']
})
export class LicenseComponent implements OnInit {
  pageTitle: string;
  pageIntro: string;
  constructor() { 
    this.pageTitle = "License & Information";
    this.pageIntro = " ";
  }
  ngOnInit() {
  }

}
