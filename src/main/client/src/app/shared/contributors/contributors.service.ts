import { Injectable } from '@angular/core';
import { Contributors } from "../../browse/models/models";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "../../../environments/environment";


@Injectable()
export class ContributorsService {

  contributors: Contributors[];
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
        this.contributors.push({"firstName": fields[0], "lastName": fields[1], "location": fields[2]})
      }
    }
    return this.contributors;
  }
}
