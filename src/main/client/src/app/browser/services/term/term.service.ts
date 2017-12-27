import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { environment } from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import {toPromise} from "rxjs/operator/toPromise";

@Injectable()
export class TermService {
    headers: Headers;
    options: RequestOptions;

    constructor(private http: Http){
        this.headers = new Headers({'Content-Type': 'application/json',
                                    'Accept': 'q=0.8;application/json;q=0.9'});
        this.options = new RequestOptions({headers: this.headers});
    }
    searchTerm(query: string): Promise<any>{
        return this.http
            .get(environment.HPO_API_TERM_SEARCH_URL + '/' + query, this.options)
            .toPromise()
            .then(response => response.json())
            .catch(TermService.handleError);
    }
    searchGenesByTerm(query:string): Promise<any>{
      return this.http
        .get(environment.HPO_API_TERM_SEARCH_URL + query + '/genes', this.options)
        .toPromise()
        .then(response => response.json())
        .catch(TermService.handleError);
    }
    searchDiseasesByTerm(query:string): Promise<any>{
      return this.http
        .get(environment.HPO_API_TERM_SEARCH_URL + query + '/diseases', this.options)
        .toPromise()
        .then(response => response.json())
        .catch(TermService.handleError);
    }
    private static handleError(error: any): Promise<any> {
        console.error('Error:', error);
        return Promise.reject(error.message || error);
    }
}
