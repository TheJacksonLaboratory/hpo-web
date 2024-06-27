import { Component, OnInit } from '@angular/core';
import { environment } from "../../../../environments/environment";
import { UtilityService } from '../../../shared/utility/utility.service';

@Component({
  selector: 'app-annotations',
  templateUrl: './annotations-download.component.html',
  styleUrls: ['./annotations-download.component.scss']
})
export class AnnotationsDownloadComponent implements OnInit {

  readonly hpoaUrl = `${environment.HPO_ANNOTATION_FILE_PURL}`;
  readonly maxoUrl = `${environment.MAXO_ANNOTATION_FILE_PURL}`;
  version: string;
  constructor(public utilityService: UtilityService) {}

  ngOnInit() {
    this.utilityService.getMostRecentReleaseHPO().subscribe((version) => {
      this.version = version;
    });
  }
}
