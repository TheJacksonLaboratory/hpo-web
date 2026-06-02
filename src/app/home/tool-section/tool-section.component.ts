import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from 'primeng/card';

interface ToolCard {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  routerLink?: string;
  url?: string;
}

@Component({
  selector: 'app-tool-section',
  standalone: true,
  imports: [RouterLink, Card],
  templateUrl: './tool-section.component.html',
  styleUrl: './tool-section.component.scss',
})
export class ToolSectionComponent {
  readonly tools: ToolCard[] = [
    {
      title: 'Bayesian Ontology Querying Algorithm',
      subtitle: 'Advanced Phenotype-Driven Disease Ranking',
      description:
        'Utilize a robust probabilistic framework to rank potential candidate diseases based on a patient\'s clinical profile. By inputting a list of Human Phenotype Ontology (HPO) terms, this algorithm leverages Bayesian networks to account for incomplete, imprecise, or noisy phenotypic data, providing a statistically sound, ranked list of differential diagnoses that best match the observed clinical features.',
      image: 'assets/highlight-images/phenomizer.png',
      routerLink: '',
    },
    {
      title: 'Phenopacket Similarity',
      subtitle: 'Standardized Clinical Case Comparison',
      description:
        'Perform deep semantic comparisons of your patient\'s clinical profile against an extensive, standardized database of GA4GH Phenopackets. This tool calculates semantic similarity scores using structured HPO terms, allowing you to discover matching clinical cases, stratify patient cohorts, and identify novel genotype-phenotype correlations by matching against established patient archives.',
      image: 'assets/highlight-images/patientarchive.png',
      routerLink: '',
    },
    {
      title: 'Exomiser',
      subtitle: 'Phenotype-Driven Genomic Variant Prioritization & Filtering',
      description:
        'Seamlessly integrate structured clinical data with high-throughput sequencing results to pinpoint causative mutations. Exomiser filters whole-exome and whole-genome sequencing data through rigorous variant frequency and pathogenicity checks, then ranks the remaining variants based on how well the known functions of the affected genes match the patient\'s specific HPO phenotypic profile.',
      image: 'assets/highlight-images/exomiser.png',
      routerLink: '',
    }
  ];
}
