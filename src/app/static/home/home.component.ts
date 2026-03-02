import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { NewsService } from '../../shared/news/news.service';
import { News } from '../../browser/models/models';
import { UtilityService } from '../../shared/utility/utility.service';
import { SearchComponent } from '../../shared/search/search/search.component';

import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-home',
    imports: [
    RouterModule,
    MatButtonModule,
    MatListModule,
    MatProgressBarModule,
    MatIconModule,
    SearchComponent
],
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
