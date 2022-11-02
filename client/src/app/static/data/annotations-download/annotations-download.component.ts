import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../../../shared/utility/utility.service';

@Component({
  selector: 'app-annotations',
  templateUrl: './annotations-download.component.html',
  styleUrls: ['./annotations-download.component.scss']
})
export class AnnotationsDownloadComponent implements OnInit {

  readonly hpoaUrl = 'http://purl.obolibrary.org/obo/hp/hpoa/phenotype.hpoa';
  version: string;
  constructor(public utilityService: UtilityService) {}

  ngOnInit() {
    this.utilityService.getMostRecentReleaseHPO().subscribe((version) => {
      this.version = version;
    });
  }
}
