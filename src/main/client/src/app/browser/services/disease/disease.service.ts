import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class DiseaseService {
    options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'q=0.8;application/json;q=0.9'
      })
    };

    constructor(private http: HttpClient) {
    }
    searchDisease(query: string): Observable<any> {
        return this.http
            .get(environment.HPO_API_DISEASE_SEARCH_URL + '/' + query, this.options);
    }
    searchMonarch(query: string): Observable<any> {
      return this.http
        .get(environment.HPO_MONARCH_DISEASE_URL + query, this.options);
    }

  downloadAssociations(disease: string, association: string): void {
    window.open(environment.HPO_API_DOWNLOAD_EXCEL_DISEASE_URL + '?identifier=' + disease + '&association=' + association,
      '_self');
  }
}
