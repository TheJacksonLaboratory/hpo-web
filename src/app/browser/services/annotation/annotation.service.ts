import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DiseaseAssociation, Gene, GeneAssociation, PhenotypeAssociation, SimpleTerm, Term } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class AnnotationService {

  constructor(private httpClient: HttpClient) {}

  fromPhenotype(id: string): Observable<PhenotypeAssociation> {
    return this.httpClient.get<PhenotypeAssociation>(environment.ONTOLOGY_NETWORK_ANNOTATION_API + id);
  }

  fromDisease(id: string): Observable<DiseaseAssociation> {
    return this.httpClient.get<DiseaseAssociation>(environment.ONTOLOGY_NETWORK_ANNOTATION_API + id);
  }

  fromGene(id: string): Observable<GeneAssociation> {
    return this.httpClient.get<GeneAssociation>(environment.ONTOLOGY_NETWORK_ANNOTATION_API + id);
  }

  searchGene(query: string, limit: number): Observable<SimpleTerm[]> {
    return this.httpClient.get<SimpleTerm[]>(`${environment.ONTOLOGY_NETWORK_SEARCH_API}gene?q=${query}&limit=${limit}`);
  }

  searchDisease(query: string, limit: number): Observable<SimpleTerm[]> {
    return this.httpClient.get<SimpleTerm[]>(`${environment.ONTOLOGY_NETWORK_SEARCH_API}disease?q=${query}&limit=${limit}`);
  }

  searchProfile(query: string): Observable<SimpleTerm[]> {
    return this.httpClient.get<SimpleTerm[]>(`${environment.ONTOLOGY_NETWORK_SEARCH_API}disease/intersect?p=${query}`);
  }
}
