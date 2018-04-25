import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Observable";

@Injectable()
export class SearchService {
    options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'q=0.8;application/json;q=0.9'
      })
    };
    constructor(private http: HttpClient){
    }
    searchAll(query: string): Observable<any>{
        return this.http
            .get(environment.HPO_API_SEARCH_URL + '?q=' + query, this.options);
    }

    searchFetchAll(query: string): Observable<any>{
      return this.http
        .get(environment.HPO_API_SEARCH_URL + '?q=' + query +'&fetchAll=true', this.options);
    }
}
