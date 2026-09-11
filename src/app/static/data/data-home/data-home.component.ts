import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';

import { UtilityService } from '../../../shared/utility/utility.service';
import { environment } from '../../../../environments/environment';

export type DataTab = 'ontology' | 'annotations' | 'api';

interface DataFile {
  name: string;
  description: string;
  url: string;
}

@Component({
  selector: 'app-data-home',
  standalone: true,
  imports: [MatIconModule, Tabs, TabList, Tab, TabPanels, TabPanel],
  templateUrl: './data-home.component.html',
})
export class DataHomeComponent implements OnInit {

  activeTab: DataTab = 'ontology';
  version?: string;

  readonly releasesUrl = environment.HPO_RELEASES;
  readonly annotationsInfoUrl = environment.HPO_ANNOTATIONS_INFO_URL;

  readonly ontologyFiles: DataFile[] = [
    { name: 'hp.obo', description: 'OBO flat file format, widely supported by ontology editing tools', url: `${environment.ONTO_RELEASE_NO_EXT}.obo` },
    { name: 'hp.owl', description: 'OWL format for semantic web tools and reasoners', url: `${environment.ONTO_RELEASE_NO_EXT}.owl` },
    { name: 'hp.json', description: 'JSON format for use in code and OBO Graph tooling', url: `${environment.ONTO_RELEASE_NO_EXT}.json` },
  ];

  readonly annotationFiles: DataFile[] = [
    { name: 'phenotype.hpoa', description: 'Disease-to-phenotype annotations, with frequency and age-of-onset modifiers', url: environment.HPO_ANNOTATION_FILE_PURL },
    { name: 'maxo-annotations.tsv', description: 'Links diseases to recommended medical actions, procedures, and treatments', url: environment.MAXO_ANNOTATION_FILE_PURL },
    { name: 'genes_to_phenotype.txt', description: 'Maps genes to the phenotypes associated with their disorders', url: environment.HPO_GENES_TO_PHENOTYPE_PURL },
    { name: 'phenotype_to_genes.txt', description: 'Maps phenotypes to the genes known to cause them', url: environment.HPO_PHENOTYPE_TO_GENES_PURL },
    { name: 'genes_to_disease.txt', description: 'Maps genes to the diseases they are known to cause', url: environment.HPO_GENES_TO_DISEASE_PURL },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.activeTab = this.normalizeTab(params['tab']);

      // Keep the URL honest: /data and /data?tab=bogus both render the ontology tab,
      // so rewrite them to the canonical /data?tab=ontology rather than leaving a
      // shareable link that disagrees with what is on screen.
      if (params['tab'] !== this.activeTab) {
        this.navigateToActiveTab();
      }
    });

    this.utilityService.getMostRecentReleaseHPO().subscribe({
      next: (version) => {
        this.version = `v${version}`;
      },
      // The GitHub releases API is unauthenticated (60 req/hr per IP). When it is
      // rate-limited or unreachable the template hides the release label entirely.
      error: () => {
        this.version = undefined;
      },
    });
  }

  onTabChange(tab: string | number | undefined): void {
    this.activeTab = this.normalizeTab(tab);
    this.navigateToActiveTab();
  }

  private navigateToActiveTab(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: this.activeTab },
      queryParamsHandling: 'merge',
      // Tab selection is view state, not navigation — it should not stack history entries.
      replaceUrl: true,
    });
  }

  private normalizeTab(tab: string | number | undefined): DataTab {
    return tab === 'annotations' || tab === 'api' ? tab : 'ontology';
  }
}
