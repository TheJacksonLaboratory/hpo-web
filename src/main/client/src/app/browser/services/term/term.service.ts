import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { environment } from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class TermService {
    headers: Headers;
    options: RequestOptions;

    constructor(private http: Http){
        this.headers = new Headers({'Content-Type': 'application/json',
                                    'Accept': 'q=0.8;application/json;q=0.9'});
        this.options = new RequestOptions({headers: this.headers});
    }
    searchTerm(query: string): Observable<any>{
        return this.http
            .get(environment.HPO_API_TERM_SEARCH_URL + '/' + query, this.options)
            .map(res => res.json())
    }
    searchGenesByTerm(query:string): Observable<any>{
      return this.http
        .get(environment.HPO_API_TERM_SEARCH_URL + query + '/genes', this.options)
        .map(res => res.json());
    }
    searchDiseasesByTerm(query:string): Observable<any>{
      return this.http
        .get(environment.HPO_API_TERM_SEARCH_URL + query + '/diseases', this.options)
        .map(res => res.json());
    }
}
