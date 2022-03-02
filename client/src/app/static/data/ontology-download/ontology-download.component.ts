import { Component, OnInit } from '@angular/core';
import {UtilityService} from '../../../shared/utility/utility.service';
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-ontology',
  templateUrl: './ontology-download.component.html',
  styleUrls: ['./ontology-download.component.scss']
})
export class OntologyDownloadComponent implements OnInit {

  readonly oboUrl = `${environment.OBO_PURL_NO_EXT}.obo`;
  readonly owlUrl = `${environment.OBO_PURL_NO_EXT}.owl`;
  readonly jsonUrl = `${environment.OBO_PURL_NO_EXT}.json`;
  version: string;
  constructor(public utilityService: UtilityService) {}

  ngOnInit() {
    this.utilityService.getMostRecentReleaseHPO().subscribe((version) => {
      this.version = version;
    });
  }
}
