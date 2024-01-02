import {Injectable} from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { catchError, map } from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { AnnotationService } from '../../../browser/services/annotation/annotation.service';
import { OntologyService } from '../../../browser/services/ontology/ontology.service';

@Injectable({providedIn: 'root'})
export class SearchService {
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'q=0.8;application/json;q=0.9'
    })
  };

  constructor(private http: HttpClient, private ontologyService: OntologyService, private annotationService: AnnotationService) {
  }

  searchFetchAll(query: string): Observable<any> {
    return this.http
      .get(environment.HPO_API_SEARCH_URL + '?q=' + query + '&max=-1', this.options);
  }

  searchAll(query: string): Observable<any> {
   return forkJoin( {
      terms: this.ontologyService.search(query).pipe(catchError(e => { console.error(e); return of([])})),
      genes: this.annotationService.searchGene(query).pipe(catchError( e => {console.error(e); return of([])})),
      diseases: this.annotationService.searchDisease(query).pipe(catchError(e => of([])))})
  }
}
