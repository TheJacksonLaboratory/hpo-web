import { Component } from '@angular/core';
import { Card } from 'primeng/card';

type ImageHeader = {
  type: 'image';
  src: string;
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
};

type IconHeader = {
  type: 'icon';
  icon: string;
  bgColor?: string;
  iconColor?: string;
};

type ResourceCardHeader = ImageHeader | IconHeader;

interface ResourceCard {
  header: ResourceCardHeader;
  title: string;
  subtitle: string;
  description: string;
  url?: string;
}

@Component({
  selector: 'app-resources-section',
  standalone: true,
  imports: [Card],
  templateUrl: './resources-section.component.html',
  styleUrl: './resources-section.component.scss',
})
export class ResourcesSectionComponent {
  readonly resources: ResourceCard[] = [
    {
      header: { type: 'image', src: 'assets/ga4gh.svg', fit: 'scale-down' },
      title: 'GA4GH Partnership',
      subtitle: 'Global Alliance for Genomics and Health',
      description:
        'HPO is a core component of GA4GH standards, including Phenopackets and the Variant Interpretation for Cancer Consortium. Our collaboration drives interoperability across genomic and clinical data sharing worldwide.',
      url: 'https://www.ga4gh.org/',
    },
   {
      header: { type: 'image', src: 'assets/abstract-blue.png', fit: 'cover' },
      title: 'Robinson Lab Bioinformatics',
      subtitle: 'More about this Team',
      description:
        'Discover additional tools, datasets, and research outputs from the Robinson Lab at Charite and The Jackson Laboratory. Our team develops open-source resources for phenotype-driven disease analysis and genomic medicine.',
      url: 'https://www.jax.org/',
    },
    {
      header: { type: 'image', src: 'assets/tools-banner.png', fit: 'cover' },
      title: 'HPO Tools',
      subtitle: 'Explore HPO in Other Tools',
      description:
        'HPO is integrated into many genomic, diagnostic, and AI resources. Explore and leverage the phenotype ontology terms through BioPortal, OLS, Ontobee, and other tools that build on the HPO standard.',
      url: 'https://obophenotype.github.io/human-phenotype-ontology/tools/overview/'   
    }
  ];
}
