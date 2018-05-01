import { Component, OnInit } from '@angular/core';
import { News } from "../../browse/models/models";
import { NewsService } from "../../shared/news/news.service";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  dates: Array<string>;
  currentSelected: string = "April 2018";
  content: Array<News>;
  error: boolean = false;
  constructor(private newsService: NewsService) {

  }

  ngOnInit() {
    this.newsService.getUniqueDates().subscribe((dates) => {
      if(dates){
        this.dates = dates;
        this.updateNewsItems();
      }else{
        this.error = true;
      }
    });
  }

  setCurrentDate(date){
    this.currentSelected = date;
    this.updateNewsItems();
  }

  updateNewsItems(){
    this.newsService.getNewsByDate(this.currentSelected).subscribe((data) =>{
      if(data){
        this.content = data;
      }else{
        this.error = true;
      }

    })
  }

}
