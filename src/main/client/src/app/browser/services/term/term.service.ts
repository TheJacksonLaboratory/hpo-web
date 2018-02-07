import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../../environments/environment';


@Injectable()
export class TermService {
    options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'q=0.8;application/json;q=0.9'
       })
    };

    constructor(private http: HttpClient){
    }
    searchTerm(query: string): Observable<any>{
        return this.http
            .get(environment.HPO_API_TERM_SEARCH_URL + '/' + query, this.options);
    }
    searchGenesByTerm(query:string): Observable<any>{
      return this.http
        .get(environment.HPO_API_TERM_SEARCH_URL + query + '/genes', this.options);
    }
    searchDiseasesByTerm(query:string): Observable<any>{
      return this.http
        .get(environment.HPO_API_TERM_SEARCH_URL + query + '/diseases', this.options);
    }
}
