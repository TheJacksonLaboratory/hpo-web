import { Injectable, OnInit } from '@angular/core';
import { News } from '../../browse/models/models';
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
      const news = [];
      const d = new Date();
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
        'October', 'November', 'December'];
      let monthIndex = d.getMonth();
      let currentMonthYear = months[d.getMonth()] + ' ' +  d.getFullYear();
      /* Loop until we have at least 3 items for the front page */
      while (news.length < 3) {
        /* check the hash for the current Month Year
        *  If not go back a month.
        *  otherwise add that months news to the array.
        * */
        if (this.allNews[currentMonthYear]) {
          for (const item of this.allNews[currentMonthYear]) {
            item.monthYear = currentMonthYear;
            if (news.length < 3) {
              news.push(item);
            }
          }
        }
        monthIndex = monthIndex === 1 ? 12 : monthIndex - 1;
        currentMonthYear = months[monthIndex] + ' ' +  d.getFullYear();
      }
      return news;
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
