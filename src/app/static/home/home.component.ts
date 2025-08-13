import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../shared/news/news.service';
import { News } from '../../browser/models/models';
import { UtilityService } from '../../shared/utility/utility.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  searchString: string;
  teaserNews: News[];
  newsError: boolean;
  loadingNews: boolean = false;

  constructor(private newsService: NewsService, public utilityService: UtilityService) {
  }

  ngOnInit() {
    this.loadingNews = true;
    this.newsService.getTeaserNews().subscribe(news => {
      this.teaserNews = news;
    }, (error) => {
      this.newsError = true;
      this.loadingNews = false;
      console.error(error);
    }, () => this.loadingNews = false);
  }
}
