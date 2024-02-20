import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import { UtilityService } from "../utility/utility.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  readonly  title: string;
  version: string;

  constructor(private utilityService: UtilityService) {
    this.title = 'Human Phenotype Ontology';
  }

  ngOnInit() {
    this.utilityService.getMostRecentReleaseHPO().subscribe((date) => {
        this.version = `hpo-web@${environment.VERSION} - hpo-obo@${date}`;
    });
  }

}
