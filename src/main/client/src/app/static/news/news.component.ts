import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  dates: Array<string> = ["May 2018", "January 2018", "July 2017"];
  constructor() { }

  ngOnInit() {
  }

}
