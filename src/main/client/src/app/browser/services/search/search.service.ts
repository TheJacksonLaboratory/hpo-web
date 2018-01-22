import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Observable";

@Injectable()
export class SearchService {
    headers: Headers;
    options: RequestOptions;

    constructor(private http: Http){
        this.headers = new Headers({'Content-Type': 'application/json',
                                    'Accept': 'q=0.8;application/json;q=0.9'});
        this.options = new RequestOptions({headers: this.headers});
    }
    searchAll(query: string): Observable<any>{
        return this.http
            .get(environment.HPO_API_SEARCH_URL + '?q=' + query, this.options)
            .map(res => res.json())
    }
}
