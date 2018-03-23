import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from "rxjs/Observable";

@Injectable()
export class DiseaseService {
    options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'q=0.8;application/json;q=0.9'
      })
    };

    constructor(private http: HttpClient){
    }
    searchDisease(query: string): Observable<any>{
        return this.http
            .get(environment.HPO_API_DISEASE_SEARCH_URL + '?q=' + query, this.options);
    }
}
