import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { AnnotationService } from '../../../browser/services/annotation/annotation.service';
import { OntologyService } from '../../../browser/services/ontology/ontology.service';
import { OntologySearchResponse, SimpleTerm, OntologyAnnotationSearchResult } from '../../../browser/models/models';

@Injectable({ providedIn: 'root' })
export class SearchService {
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'q=0.8;application/json;q=0.9'
    })
  };

  constructor(private ontologyService: OntologyService, private annotationService: AnnotationService) {
  }

  searchAll(query: string, limit: number): Observable<{ terms: OntologySearchResponse; genes: OntologyAnnotationSearchResult<SimpleTerm>; diseases: OntologyAnnotationSearchResult<SimpleTerm> }> {
    return forkJoin({
      terms: this.ontologyService.search(query, limit).pipe(
        catchError((e) => {
          console.error(e);
          return of<OntologySearchResponse>({ terms: [] });
        })
      ),
      genes: this.annotationService.searchGene(query, limit).pipe(
        catchError((e) => {
          console.error(e);
          return of<OntologyAnnotationSearchResult<SimpleTerm>>({ results: [], totalCount: 0 });
        })
      ),
      diseases: this.annotationService.searchDisease(query, limit).pipe(
        catchError((e) => {
          console.error(e);
          return of<OntologyAnnotationSearchResult<SimpleTerm>>({ results: [], totalCount: 0 });
        })
      )
    });
  }
}
