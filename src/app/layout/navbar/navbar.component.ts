import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

/** A top-level navbar link; `iconEnd` places the icon after the label. */
interface NavbarItem extends MenuItem {
  iconEnd?: boolean;
}

/**
 * HPO top navigation bar: logo, the site's main links, and the Copied Terms button.
 *
 * Built on PrimeNG's menubar, which collapses the links into a hamburger menu below 960px.
 */
@Component({
  selector: 'app-navbar',
  imports: [MenubarModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent {
  readonly items: NavbarItem[] = [
    { label: 'Data', routerLink: 'data' },
    { label: 'Tools', routerLink: '' },
    {
      label: 'Documentation',
      icon: 'pi pi-external-link',
      iconEnd: true,
      url: 'https://obophenotype.github.io/human-phenotype-ontology/',
      target: '_blank',
    },
  ];
}
