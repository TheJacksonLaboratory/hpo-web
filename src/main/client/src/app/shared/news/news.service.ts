import { Injectable, OnInit } from '@angular/core';
import { News } from '../../browser/models/models';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, publishReplay, refCount } from 'rxjs/internal/operators';

@Injectable()
export class NewsService {
  private allNews: any;
  private newsObservable$: any;
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'q=0.8;application/json;q=0.9'
    })
  };

  constructor(private http: HttpClient) { }


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
    news = [].concat.apply([], news);
    news.sort((a, b) => {
      const a1 = new Date(a.date);
      const b1 = new Date(b.date);
      return a1 > b1 ? -1 : a1 < b1 ? 1 : 0;
    });
    return news.slice(0, 3);
  }

  /* Get news items from github and store it as a "cache" */
  getNews(): Observable<News[]> {
    if (!this.newsObservable$) {
      this.newsObservable$ =  this.http.get(environment.HPO_NEWS_JSON_URL).pipe(
        publishReplay(1),
        refCount()
      );
    }
    return this.newsObservable$;
  }

  /* Get the news items from the api */
  setAllNews(news: News[]): void {
      this.allNews = news;
  }
}
