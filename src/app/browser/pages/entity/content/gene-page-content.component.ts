import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AssociationsTableBlockComponent, SortOption } from '../../../components/entity/associations-table-block/associations-table-block.component';
import { IdBadgeComponent } from '../../../components/entity/id-badge/id-badge.component';
import { GenePageViewModel } from '../entity-page.types';

/**
 * The gene page's content column: the Entrez summary followed by its phenotype
 * and disease association sections.
 *
 * Renders the middle column only. The page grid and the sticky "On this page"
 * aside belong to {@link EntityPageComponent} and are shared with the phenotype
 * and disease pages. Gene has no hierarchy, so unlike the phenotype page there
 * is no left rail beside this column.
 */
@Component({
  selector: 'app-gene-page-content',
  standalone: true,
  imports: [RouterLink, AssociationsTableBlockComponent, IdBadgeComponent],
  templateUrl: './gene-page-content.component.html',
})
export class GenePageContentComponent {
  /** The resolved gene page data. */
  @Input({ required: true }) viewModel: GenePageViewModel;

  /**
   * Where each section's "contribute" call to action points when that section
   * is empty.
   *
   * TODO(HPO-201): placeholders - replace with the real contribution targets
   * for phenotype and disease annotations.
   */
  readonly contributeLinks = {
    phenotype: 'https://www.google.com',
    disease: 'https://www.google.com',
  };

  /** "Sort by" options offered above the phenotype associations table. */
  readonly phenotypeSortOptions: SortOption[] = [
    { label: 'Term Name (A-Z)', field: 'name', order: 1 },
    { label: 'Term Name (Z-A)', field: 'name', order: -1 },
    { label: 'Term ID (A-Z)', field: 'id', order: 1 },
  ];
}
