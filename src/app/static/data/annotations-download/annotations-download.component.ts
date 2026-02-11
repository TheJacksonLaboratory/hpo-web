import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { environment } from "../../../../environments/environment";
import { UtilityService } from '../../../shared/utility/utility.service';

@Component({
    selector: 'app-annotations',
    imports: [CommonModule, MatIconModule],
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
