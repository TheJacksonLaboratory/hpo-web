import {Component} from '@angular/core';
import {UtilityService} from '../../../shared/utility.service';

@Component({
  selector: 'app-annotations',
  templateUrl: './annotations-download.component.html',
  styleUrls: ['./annotations-download.component.scss']
})
export class AnnotationsDownloadComponent {

  readonly hpoaUrl = 'http://purl.obolibrary.org/obo/hp/hpoa/phenotype.hpoa';
  constructor(public utilityService: UtilityService) {
  }
}
