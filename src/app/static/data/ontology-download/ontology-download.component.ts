import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UtilityService } from '../../../shared/utility/utility.service';
import { environment } from "../../../../environments/environment";

@Component({
    selector: 'app-ontology',
    imports: [MatIconModule],
    templateUrl: './ontology-download.component.html',
    styleUrls: ['./ontology-download.component.scss']
})
export class OntologyDownloadComponent implements OnInit {

  readonly oboUrl = `${environment.ONTO_RELEASE_NO_EXT}.obo`;
  readonly owlUrl = `${environment.ONTO_RELEASE_NO_EXT}.owl`;
  readonly jsonUrl = `${environment.ONTO_RELEASE_NO_EXT}.json`;
  readonly otherReleases = environment.HPO_RELEASES;
  version: string;
  constructor(public utilityService: UtilityService) {}

  ngOnInit() {
    this.utilityService.getMostRecentReleaseHPO().subscribe((version) => {
      this.version = `v${version}`
    });
  }
}
