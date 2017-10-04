import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class SearchService {
    headers: Headers;
    options: RequestOptions;

    constructor(private http: Http){
        this.headers = new Headers({'Content-Type': 'application/json',
                                    'Accept': 'q=0.8;application/json;q=0.9'});
        this.options = new RequestOptions({headers: this.headers});
    }
    searchAll(query: string): Promise<any>{
        return this.http
            .get('http://localhost:8080/hpo/search?q=' + query, this.options)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    private handleError(error: any): Promise<any> {
        console.error('Error:', error);
        return Promise.reject(error.message || error);
    }
}