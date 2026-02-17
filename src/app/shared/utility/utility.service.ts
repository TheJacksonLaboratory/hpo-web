import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { map, shareReplay } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private http: HttpClient) { }

  openExternalUrl(url: string) {
    window.open(url, '_blank').focus();
  }

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
      map((version: { tag_name: string }) => {
        const version_date = version.tag_name.replace('v','')
        if(version_date == '' || version_date === undefined){
          return "latest"
        }
        return version_date;
      }),
      shareReplay(1)
    );
  }

  getExternalTermIdUrlFromId(termId?: string) {
    if(!termId){
      return '';
    }
    const sourceParts = termId.split(':');
    if (this.isTermIdExpected(termId, "OMIM")) {
      return `https://omim.org/entry/${sourceParts[1]}`;
    } else if (this.isTermIdExpected(termId, "ORPHA")) {
      return `https://www.orpha.net/consor/cgi-bin/OC_Exp.php?Lng=EN&Expert=${sourceParts[1]}`
    } else if (this.isTermIdExpected(termId, "MONDO")){
      return `https://monarchinitiative.org/disease/${termId}`;
    } else if(this.isTermIdExpected(termId, "PMID")){
      return `https://www.ncbi.nlm.nih.gov/pubmed/${sourceParts[1]}`;
    }
  }

  isTermIdExpected(diseaseId: string, expected: string) {
    return diseaseId != "" && diseaseId != null && expected != "" && expected != null
      ? diseaseId.toUpperCase().includes(expected) : false;
  }

  getDiseaseDatabaseName(diseaseId: string){
    return diseaseId != "" && diseaseId != null ? diseaseId.split(':')[0] : '';
  }
}
