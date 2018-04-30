import { Injectable } from '@angular/core';
import { Contributors } from "../../browse/models/models";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "../../../environments/environment";


@Injectable()
export class ContributorsService {

  contributors: Contributors[] = [];
  constructor(private http: HttpClient) { }

  getContributors(): Observable<Contributors[]> {
   return this.http.get(environment.HPO_CONTRIBUTORS_URL, {responseType:'text'}).map(res => {
      return this.buildContributors(res.split("\n"));
    })
  }

  buildContributors(lines: string[]) {
    if(lines){
      for(let line of lines) {
        let fields = line.split(",");
        let firstName = fields.shift();
        let lastName = fields.shift();
        let location = fields.join(",").replace(/['"]+/g, '');
        this.contributors.push({"firstName": firstName, "lastName": lastName, "location": location})
      }
    }
    return this.contributors;
  }
}
