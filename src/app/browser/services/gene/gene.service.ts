import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

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

  searchGeneInfo(query: string): Observable<any> {
    return this.http
      .get(environment.HPO_ENTREZ_SEARCH_URL + '?db=gene&id=' + query + '&retmode=json');
  }

  searchUniprot(query: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('from', 'P_ENTREZGENEID');
    params = params.append('to', 'ACC');
    params = params.append('query', query);
    params = params.append('format', 'tab');
    params = params.append('columns', 'id,reviewed');
    return this.http
      .post(environment.HPO_UNIPROT_MAPPING_URL, null, {params: params, responseType: 'text'})
      .pipe(map(res => this.parseUniprotMapping(res.split('\n'))));
  }

  // Uniprot respopnses are in a tab seperated format.
  // Particularly a response could have multiple proteins for a gene,
  // however we only want the review one, if it has one otherwise assume it does not.
  private parseUniprotMapping(lines: string[]) {
    const reviewed = lines.map(line => line.split('\t'))
      .filter(line => line[1] === 'reviewed');

    return ((reviewed.length > 0) ? reviewed[0][0] : null);
  }
}
