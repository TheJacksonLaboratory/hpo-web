import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { environment } from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GeneService {
  headers: Headers;
  options: RequestOptions;

  constructor(private http: Http){
      this.headers = new Headers({'Content-Type': 'application/json',
                                  'Accept': 'q=0.8;application/json;q=0.9'});
      this.options = new RequestOptions({headers: this.headers});
  }
  searchGene(query: string): Promise<any>{
      return this.http
          .get(environment.HPO_API_GENE_SEARCH_URL + '?q=' + query, this.options)
          .toPromise()
          .then(response => response.json())
          .catch(this.handleError);
  }
  searchGeneInfo(query: string): Promise<any>{
    return this.http
      .get( environment.HPO_ENTREZ_SEARCH_URL + '?db=gene&id=' + query + '&retmode=json')
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  searchUniprot(query:string): Promise<any>{
    let payload = new URLSearchParams();
    payload.set('from', "P_ENTREZGENEID");
    payload.set('to', "ACC");
    payload.set('query',query);
    payload.set('format', "tab");
    payload.set('columns',"id,reviewed");
    return this.http
      .post(environment.HPO_UNIPROT_MAPPING_URL,payload).toPromise().then(res =>{
        return this.parseUniprotMapping(res.text().split("\n"));
      }).catch(this.handleError);
}
  private handleError(error: any): Promise<any> {
      console.error('Error:', error);
      return Promise.reject(error.message || error);
  }

  private parseUniprotMapping(lines: string[]){
    let lineCount = 0;
    for(let line of lines){
      if(lineCount != 0) {
        let mapping = line.split("\t");
        if(mapping[1] == "reviewed"){
          return mapping[0];
        }
      }
      lineCount++;
    }
    return null;
  }
}
