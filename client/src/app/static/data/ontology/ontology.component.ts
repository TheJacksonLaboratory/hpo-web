import {Component} from '@angular/core';
import {UtilityService} from '../../../shared/utility.service';

@Component({
  selector: 'app-ontology',
  templateUrl: './ontology.component.html',
  styleUrls: ['./ontology.component.scss']
})
export class OntologyComponent {

  readonly oboUrl = 'http://purl.obolibrary.org/obo/hp.obo';
  readonly owlUrl = 'http://purl.obolibrary.org/obo/hp.owl';
  constructor(public utilityService: UtilityService) {}
}
