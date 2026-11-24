import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

interface FooterItem {
  label: string;
  routerLink?: string;
  url?: string;
  target?: string;
}

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  readonly version = environment.VERSION;

  readonly navItems: FooterItem[] = [
    { label: 'About', routerLink: '/about' },
    { label: 'License', routerLink: '/license' },
    { label: 'Funding', routerLink: '/funding' },
    { label: 'Cite', routerLink: '/citation' },
    { label: 'Disclaimer', routerLink: '/disclaimer' }
  ];
}
