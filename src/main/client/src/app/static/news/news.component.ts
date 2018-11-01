import { Component, OnInit } from '@angular/core';
import { News } from '../../browse/models/models';
import { NewsService } from '../../shared/news/news.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  dates: Array<string>;
  currentSelected = '';
  teaserDate = '';
  content: Array<News>;
  error = false;
  constructor(private newsService: NewsService, private route: ActivatedRoute ) {

  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.teaserDate = params['id'];
    });
    this.newsService.getUniqueDates().subscribe((dates) => {
      if (dates) {
        this.dates = dates;
        this.currentSelected = this.teaserDate && dates.includes(this.teaserDate) ? this.teaserDate : dates[0];
        this.updateNewsItems();
      } else {
        this.error = true;
      }
    });

  }

  setCurrentDate(date) {
    this.currentSelected = date;
    this.updateNewsItems();
  }

  updateNewsItems() {
    this.newsService.getNewsByDate(this.currentSelected).subscribe((data) => {
      if (data) {
        this.content = data;
      } else {
        this.error = true;
      }

    });
  }

}
