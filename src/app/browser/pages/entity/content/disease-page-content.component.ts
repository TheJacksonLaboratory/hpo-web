import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UtilityService } from '../../../../shared/utility/utility.service';
import { AssociationsTableBlockComponent, SortOption } from '../../../components/entity/associations-table-block/associations-table-block.component';
import { IdBadgeComponent } from '../../../components/entity/id-badge/id-badge.component';
import { BODY_SYSTEM_ORDER } from '../entity-data.resolvers';
import { DiseasePageViewModel, DiseasePhenotypeRow } from '../entity-page.types';

/** Label and link style for one provenance entry in a phenotype's Source(s) cell. */
interface PhenotypeSource {
  /** Text shown in the cell, e.g. `PubMed` or `OMIM`. */
  label: string;
  /** Where the entry links to. */
  href: string;
}

/**
 * The disease page's content column: the disease header followed by its
 * phenotype and gene association sections.
 *
 * Renders the middle column only. The page grid and the sticky "On this page"
 * aside belong to {@link EntityPageComponent}.
 */
@Component({
  selector: 'app-disease-page-content',
  standalone: true,
  imports: [RouterLink, AssociationsTableBlockComponent, IdBadgeComponent],
  templateUrl: './disease-page-content.component.html',
})
export class DiseasePageContentComponent {
  /** The resolved disease page data. */
  @Input({ required: true }) viewModel: DiseasePageViewModel;

  /**
   * Where each section's "contribute" call to action points when that section
   * is empty.
   *
   * TODO(HPO-201): replace the placeholders with the real contribution targets.
   */
  readonly contributeLinks = {
    phenotype: 'https://www.google.com',
    gene: 'https://www.google.com',
  };

  /**
   * "Sort by" options offered above the phenotype table. Every option sorts on
   * the grouped field, since sorting by anything else splits a body system into
   * several groups.
   */
  readonly phenotypeSortOptions: SortOption[] = [
    { label: 'Body System (A-Z)', field: 'category', order: 1 },
    { label: 'Body System (Z-A)', field: 'category', order: -1 },
  ];

  /** Order the phenotype table lists body systems in until a sort is chosen. */
  readonly bodySystemOrder = BODY_SYSTEM_ORDER;

  constructor(public utilityService: UtilityService) {}

  /**
   * The linkable provenance entries for one phenotype annotation.
   *
   * @param row The phenotype row whose `sources` to render.
   * @returns One entry per source, labelled by which database it came from.
   */
  phenotypeSources(row: DiseasePhenotypeRow): PhenotypeSource[] {
    return row.sources.map((source) => {
      if (this.utilityService.isTermIdExpected(source, 'PMID')) {
        return { label: 'PubMed', href: this.utilityService.getExternalTermIdUrlFromId(source) };
      }
      if (this.utilityService.isTermIdExpected(source, 'BOOKSHELF')) {
        return { label: 'Gene Review', href: source };
      }
      return {
        label: this.utilityService.getDiseaseDatabaseName(source),
        href: this.utilityService.getExternalTermIdUrlFromId(source),
      };
    });
  }
}
