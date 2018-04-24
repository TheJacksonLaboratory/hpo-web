import { Injectable, OnInit } from '@angular/core';
import { News } from "../../browse/models/models";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {forEach} from "@angular/router/src/utils/collection";

@Injectable()
export class NewsService {
  private allNews: any;
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'q=0.8;application/json;q=0.9'
    })
  };
  queryRunning: boolean = false;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {

  }


  getNewsByDate(date: string): Observable<News[]> {
    if (this.allNews && this.allNews[date]) {
      return Observable.of(this.allNews[date]);
    } else {
      return Observable.of(null);
    }
  }

  getUniqueDates(): Observable<Array<string>> {
    if (this.allNews) {
      return Observable.of(this._getDates());
    }else{
      return Observable.of(null);
    }
  }

  /* Return all dates */
  private _getDates(): Array<string> {
    if (this.allNews){
      return Object.keys(this.allNews);
    }
  }

  getTeaserNews(): News[]{
    if(this.allNews){
      let news = [];
      let d = new Date();
      let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let monthIndex = d.getMonth();
      let currentMonthYear = months[d.getMonth()] + ' ' +  d.getFullYear();
      /* Loop until we have at least 3 items for the front page */
      while(news.length < 3){
        /* check the hash for the current Month Year
        *  If not go back a month.
        *  otherwise add that months news to the array.
        * */
        if(this.allNews[currentMonthYear]){
          for(let item of this.allNews[currentMonthYear]){
            if(news.length < 3){
              news.push(item);
            }
          }
        }
        monthIndex = monthIndex == 1 ? 12 : monthIndex - 1;
        currentMonthYear = months[monthIndex] + ' ' +  d.getFullYear();
      }
      return news;
    }
  }

  setAllNews(): void {
    this.http.get(environment.HPO_NEWS_JSON_URL).subscribe((data) => {
      this.allNews = data;
    }, (error) => {
      this.allNews = null;
    });
  }
}
