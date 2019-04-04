import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { environment } from '../../../../environments/environment';


@Injectable()
export class TermService {
     headers;

    constructor(private http: HttpClient) {
      this.headers = new HttpHeaders()
        .set('Accept', 'q=0.8;application/json;q=0.9')
        .set('Content-Type', 'application/json');
    }

    searchTerm(query: string): Observable<any> {
      const options = { headers: null };
      options.headers = this.headers;

        return this.http
            .get(environment.HPO_API_TERM_SEARCH_URL + '/' + query, options);
    }

    searchLoincByTerm(query: string): Observable<any>{
      const options = {headers: null, params: null};
      options.headers = this.headers;
      return this.http.get(environment.HPO_API_TERM_SEARCH_URL + query + '/loinc', options);
    }

    searchGenesByTerm(query: string, offset: string = '0', max: string = '20'): Observable<any> {
      const params =   new HttpParams()
        .set('offset', offset)
        .set('max', max);

      const options = {headers: null, params: null};
      options.headers = this.headers;
      options.params = params;

      return this.http
        .get(environment.HPO_API_TERM_SEARCH_URL + query + '/genes', options);
    }

    searchDiseasesByTerm(query: string, offset: string = '0', max: string = '20'): Observable<any> {
      const params = new HttpParams()
        .set('offset', offset)
        .set('max', max);

      const options = {headers: null, params: null};
      options.headers = this.headers;
      options.params = params;

      return this.http
        .get(environment.HPO_API_TERM_SEARCH_URL + query + '/diseases', options);
    }

  downloadAssociations(term: string, association: string): void {
    window.open(environment.HPO_API_DOWNLOAD_EXCEL_TERM_URL + '?identifier=' + term + '&association=' + association,
      '_self');
  }
}
