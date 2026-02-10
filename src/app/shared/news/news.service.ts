import { Injectable } from '@angular/core';
import { News } from '../../browser/models/models';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, shareReplay } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class NewsService {
  private newsObservable$: Observable<News[]>;
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'q=0.8;application/json;q=0.9'
    })
  };

  constructor(private http: HttpClient) {
  }


  /* Return a specific months news */
  getNewsByDate(date: string): Observable<News[]> {
    if (date) {
      return this.getNews().pipe(
        map(news => news[date])
      );
    }
  }

  /* Return all unique month-years with news*/
  getUniqueDates(): Observable<Array<string>> {
    return this.getNews().pipe(
      map(news => this._getDates(news))
    );
  }

  /* Return all month years */
  _getDates(news: News[]): Array<string> {
    return Object.keys(news);
  }

  /* Get the teaser news for homepage */
  getTeaserNews(): Observable<News[]> {
    return this.getNews().pipe(
      map(news => this.selectTeasers(news))
    );
  }

  /* Get the 3 most recent news items */
  selectTeasers(allNews: News[]) {
    let news = Object.keys(allNews).map(key => allNews[key]);
    news = [].concat(...news);
    news.sort((a, b) => {
      const a1 = new Date(a.date);
      const b1 = new Date(b.date);
      return a1 > b1 ? -1 : a1 < b1 ? 1 : 0;
    });
    news.forEach(function (item) {
      const monthYear = item.date.split(',');
      item.monthYear = monthYear[0].split(' ')[0] + monthYear[1];
    });
    return news.slice(0, 3);
  }

  /* Get news items from github and store it as a "cache" */
  getNews(): Observable<News[]> {
    if (!this.newsObservable$) {
      this.newsObservable$ = this.http.get<News[]>(environment.HPO_NEWS_JSON_URL).pipe(
        shareReplay(1)
      );
    }
    return this.newsObservable$;
  }
}
