import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';


@Injectable()
export class TermService {
  headers;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders()
      .set('Accept', 'q=0.8;application/json;q=0.9')
      .set('Content-Type', 'application/json');
  }
  // searchIntersectingAnnotations(terms: string[]): Observable<any> {
  //   const params = new HttpParams().set("q", terms.join(","));
  //   return this.http.get(environment.HPO_API_TERM_SEARCH_URL + "/intersecting", {params: params});
  //
  // }
}
