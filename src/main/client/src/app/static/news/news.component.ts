import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { News } from '../../browser/models/models';
import { NewsService } from '../../shared/news/news.service';
import { ActivatedRoute } from '@angular/router';
import {MediaMatcher} from "@angular/cdk/layout";
import {MatSidenav} from "@angular/material/sidenav";

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  dates: Array<string>;
  currentSelected = '';
  teaserDate = '';
  content: Array<News>;
  error = false;

  @ViewChild('sidenav')
  private sidenav: MatSidenav;

  constructor(private newsService: NewsService, private route: ActivatedRoute, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
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

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  setCurrentDate(date) {
    this.sidenav.close();
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
