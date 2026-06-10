import { Component } from '@angular/core';

interface OrgLogo {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-trusted-by-section',
  standalone: true,
  imports: [],
  templateUrl: './trusted-by-section.component.html',
  styleUrl: './trusted-by-section.component.scss',
})
export class TrustedBySectionComponent {
  readonly logos: OrgLogo[] = [
    { src: 'assets/logos/jax_logo.png', alt: 'The Jackson Laboratory' },
    { src: 'assets/logos/bih-logo.svg', alt: 'Berlin Institute of Health' },
    { src: 'assets/logos/shriners_childrens.svg', alt: 'Shriners Childrens'},
    { src: 'assets/funding-images/DFG.jpg', alt: 'DFG' },
    { src: 'assets/funding-images/NIH.jpg', alt: 'NIH' },
    { src: 'assets/logos/monarch-logo.png', alt: 'Monarch Initiative' },
    { src: 'assets/logos/genomics_england_logo.png', alt: 'Genomics England' },
    { src: 'assets/funding-images/bmbf.png', alt: 'BMBF' },
    { src: 'assets/logos/mayo-clinic-logo.svg', alt: 'Mayo Clinic'}
  ];
}
