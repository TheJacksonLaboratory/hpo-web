import { Component, OnInit } from '@angular/core';
import { News } from "../../browse/models/models";
import { NewsService } from "../../shared/news/news.service";

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  dates: Array<string>;
  currentSelected: string = "April 2018";
  content: Array<News>;
  constructor(private newsService: NewsService) {
    newsService.getUniqueDates().subscribe((dates) => {
      this.dates = dates;
    });
    this.updateNewsItems();
  }

  ngOnInit() {
  }

  setCurrentDate(date){
    this.currentSelected = date;
    this.updateNewsItems();
  }

  updateNewsItems(){
    this.newsService.getNewsByDate(this.currentSelected).subscribe((data) =>{
      this.content = data;
    })

  }

}
