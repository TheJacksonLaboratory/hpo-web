import { Injectable, OnInit } from '@angular/core';
import { News } from '../../browser/models/models';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class NewsService {
  private allNews: any;
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
      if (this.allNews[date]) {
        return of(this.allNews[date]);
      } else {
        return of(null);
      }
    }
  }

  /* Return all unique month-years with news*/
  getUniqueDates(): Observable<Array<string>> {
    if (this.allNews) {
      return of(this._getDates());
    } else {
      return of(null);
    }
  }

  /* Return all month years */
  private _getDates(): Array<string> {
    if (this.allNews) {
      return Object.keys(this.allNews);
    }
  }

  getTeaserNews(): News[] {
   if (this.allNews) {
     let news = Object.keys(this.allNews).map(key => this.allNews[key]);
     news = [].concat.apply([], news);
     news.sort((a, b) => {
       const a1 = new Date(a.date);
       const b1 = new Date(b.date);
       return a1 > b1 ? -1 : a1 < b1 ? 1 : 0;
     });
     return news.slice(0, 3);
   }
  }

  /* Get the news items from the api */
  setAllNews(): void {
    this.http.get(environment.HPO_NEWS_JSON_URL).subscribe((data) => {
      this.allNews = data;
    }, (error) => {
      this.allNews = null;
    });
  }
}
