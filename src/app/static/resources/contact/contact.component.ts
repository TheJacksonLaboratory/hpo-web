import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  pageTitle: string;
  pageIntro: string;
  constructor() { 
    this.pageTitle = "Contact";
    this.pageIntro = " ";
  }
  ngOnInit() {
  }

}
