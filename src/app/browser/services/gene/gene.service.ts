import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { EntrezGeneResult } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class GeneService {
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'q=0.8;application/json;q=0.9'
    })
  };

  constructor(private http: HttpClient) {
  }

  searchGeneInfo(query: string): Observable<EntrezGeneResult> {
    return this.http
      .get<EntrezGeneResult>(environment.HPO_ENTREZ_SEARCH_URL + '?db=gene&id=' + query + '&retmode=json');
  }
}
