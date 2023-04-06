import {Injectable} from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable()
export class DiseaseService {
  options: any = {
    headers: new HttpHeaders({
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
  }

  searchDisease(query: string): Observable<any> {
    return this.http
      .get(environment.HPO_API_DISEASE_SEARCH_URL + query, this.options);
  }

  searchMonarch(query: string): Observable<any> {
    const monarch_options = this.options;
    monarch_options.params = new HttpParams().set("fetch_objects", false).set("unselect_evidence", true)
      .set("exclude_automatic_assertions", false).set("get_association_counts", false).set("rows", 1);
    return this.http
      .get(environment.HPO_MONARCH_DISEASE_URL + query, this.options);
  }

  downloadAssociations(disease: string, association: string): void {
    window.open(environment.HPO_API_DOWNLOAD_EXCEL_DISEASE_URL + '?identifier=' + disease + '&association=' + association,
      '_self');
  }
}
