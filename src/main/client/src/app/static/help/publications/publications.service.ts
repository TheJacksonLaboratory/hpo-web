import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  constructor(private http: HttpClient) { }

  getPublications() {
    return this.http
      .get(environment.HPO_PUBLICATION_REST_URL);
  }
}
