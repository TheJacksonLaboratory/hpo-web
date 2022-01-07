import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {TeamMember} from '../../browser/models/models';
import {Observable} from 'rxjs';


import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';


@Injectable()
export class TeamService {

  contributors: TeamMember[] = [];

  constructor(private http: HttpClient) {
  }

  getContributors(): Observable<TeamMember[]> {
    return this.http.get(environment.HPO_CONTRIBUTORS_URL, {responseType: 'text'}).pipe(map(res => {
      return this.buildContributors(res.split('\n'));
    }));
  }

  buildContributors(lines: string[]) {
    if (lines) {
      for (const line of lines) {
        const fields = line.split(',');
        const lastName = fields.shift();
        const firstName = fields.shift();
        const location = fields.join(',').replace(/['"]+/g, '');
        this.contributors.push({'firstName': firstName, 'lastName': lastName, 'location': location});
      }
    }
    return this.contributors;
  }
}
