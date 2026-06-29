import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { Meta } from '@angular/platform-browser';

import { JdsMenuItem, NavbarComponent } from '@jax-data-science/components';
import { FooterComponent } from './shared/footer/footer.component';
import { FloatingFeedbackComponent } from './shared/floating-feedback/floating-feedback.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    NavbarComponent,
    FooterComponent,
    FloatingFeedbackComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  readonly navbarItems: JdsMenuItem =
    [
      {
        label: "About",
        routerLink: "about"
      },
      {
        label: "Data",
        items:
          [
            {
              label: "Ontology",
              routerLink: "data/ontology"
            },
            {
              label: "API",
              routerLink: "data/api"
            }
          ]
      },
      {
        label: "Tools",
        icon: "",
        routerLink: ""
      },
      {
        label: "Documentation",
        icon: "pi pi-external-link",
        iconEnd: true,
        url: "https://obophenotype.github.io/human-phenotype-ontology/",
        target: '_blank'
      }
    ]
  constructor(meta: Meta) {
    if (!environment.production) {
      meta.addTag({ name: 'robots', content: 'noindex' });
    }
  }
}
