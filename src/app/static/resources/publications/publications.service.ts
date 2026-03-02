import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Publication } from '../../../browser/models/models';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  constructor(private http: HttpClient) {
  }

  getPublications(): Observable<Publication[]> {
    return this.http
      .get(environment.HPO_PUBLICATION_REST_URL, { responseType: 'text' }).pipe(
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
          let authors = fields.shift();
          authors = authors.split(',').length >= 3 ? authors.split(',').slice(0, 4).join(',') + ' et al.' : authors;
          const contributor = {
            'authors': authors,
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
    return contributors.sort((a, b) => (a.year > b.year ? -1 : (a.year < b.year ? 1 : 0)));
  }
}
