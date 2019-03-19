import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';
import { Publication } from '../../../browser/models/models';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  constructor(private http: HttpClient) { }

  getPublications(): Observable<Publication[]> {
    return this.http
      .get(environment.HPO_PUBLICATION_REST_URL, {responseType: 'text'}).pipe(
        map(response => {
          return this.buildPublications(response.split('\n'));
        }));
  }

  buildPublications(lines: string[]): Publication[] {
    const contributors: Publication[] = [];
    if (lines) {
      for (const line of lines) {
        const fields = line.split('\t');
        if (!fields[0].startsWith('#') && line !== '') {
          const contributor =  {
            'authors': fields.shift(),
            'title': fields.shift(),
            'journal': fields.shift(),
            'year': +fields.shift(),
            'volume': fields.shift(),
            'pages': fields.shift(),
            'pmid': fields.shift(),
            'inhouse': fields.shift() === 'T',
            'hpo': fields.shift() === 'T',
            'monarch': fields.shift() === 'T',
            'topicList': fields.shift().split(';')
          };
          contributors.push(contributor);
        }
      }
    }
    return contributors;
  }
}
