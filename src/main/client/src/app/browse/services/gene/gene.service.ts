import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable()
export class GeneService {
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'q=0.8;application/json;q=0.9'
    })
  };
  constructor(private http: HttpClient) {
  }
  searchGene(query: string): Observable<any> {
      return this.http
          .get(environment.HPO_API_GENE_SEARCH_URL + '?q=' + query, this.options);
  }
  searchGeneInfo(query: string): Observable<any> {
    return this.http
      .get( environment.HPO_ENTREZ_SEARCH_URL + '?db=gene&id=' + query + '&retmode=json');
  }
  searchUniprot(query: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('from', 'P_ENTREZGENEID');
    params = params.append('to', 'ACC');
    params = params.append('query', query);
    params = params.append('format', 'tab');
    params = params.append('columns', 'id,reviewed');
    return this.http
      .post(environment.HPO_UNIPROT_MAPPING_URL, null, { params: params, responseType: 'text' })
      .pipe(map(res => {
        return this.parseUniprotMapping(res.split('\n'));
      }));
  }

  private parseUniprotMapping(lines: string[]) {
    let lineCount = 0;
    for (const line of lines) {
      if (lineCount !== 0) {
        const mapping = line.split('\t');
        if (mapping[1] === 'reviewed') {
          return mapping[0];
        }
      }
      lineCount++;
    }
    return null;
  }
}
