import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  pageTitle: string;
  pageIntro: string;
  constructor() { 
    this.pageTitle = "Frequently Asked Questions";
    this.pageIntro = " ";
  }
  ngOnInit() {
  }

}
