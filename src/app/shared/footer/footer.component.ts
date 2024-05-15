import {Component} from '@angular/core';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  readonly  title: string;
  version = `${environment.VERSION}`;

  constructor() {
    this.title = 'Human Phenotype Ontology';
  }
}
