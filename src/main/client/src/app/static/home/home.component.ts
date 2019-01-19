import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../shared/news/news.service';
import { News } from '../../browse/models/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  searchString: string;
  teaserNews: News[];
  newsError: boolean;
  constructor(private newsService: NewsService) { }

  ngOnInit() {

   this.newsService.getTeaserNews().subscribe(news => {
     this.teaserNews = news;
     }, (error) => {
       this.newsError = true;
       console.error(error);
     });
  }
}
