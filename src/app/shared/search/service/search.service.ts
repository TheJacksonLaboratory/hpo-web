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

  constructor(private ontologyService: OntologyService, private annotationService: AnnotationService) {
  }

  searchFetchAll(query: string): Observable<any> {
      return forkJoin( {
          terms: this.ontologyService.search(query, -1).pipe(catchError(e => { console.error(e); return of([])})),
          genes: this.annotationService.searchGene(query, -1).pipe(catchError( e => {console.error(e); return of([])})),
          diseases: this.annotationService.searchDisease(query, -1).pipe(catchError(e => of([])))})
  }

  searchAll(query: string): Observable<any> {
   return forkJoin( {
      terms: this.ontologyService.search(query, 10).pipe(catchError(e => { console.error(e); return of([])})),
      genes: this.annotationService.searchGene(query, 10).pipe(catchError( e => {console.error(e); return of([])})),
      diseases: this.annotationService.searchDisease(query, 10).pipe(catchError(e => of([])))})
  }
}
