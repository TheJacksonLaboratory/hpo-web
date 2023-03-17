import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { map, publishReplay, refCount } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private http: HttpClient) { }

  downloadFile(url: string) {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', url);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  getMostRecentReleaseHPO() {
    return this.http.get(environment.HPO_GITHUB_REPO_URL + '/releases?per_page=1').pipe(
      map((versions: []) => {
        return versions.find(Boolean);
      }),
      map((version: any) => {
        const version_date = version.tag_name.replace('v','')
        if(version_date == '' || version_date === undefined){
          return "latest"
        }
        return version_date;
      }),
      publishReplay(1),
      refCount()
    );
  }
}
