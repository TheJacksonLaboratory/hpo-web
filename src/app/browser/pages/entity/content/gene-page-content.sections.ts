import { PanelMenuItem } from '../../../models/models';
import { GenePageViewModel } from '../entity-page.types';

/**
 * Section config for the gene page. Each `anchor` must match an `anchorId` in
 * `gene-page-content.component.html`.
 *
 * Medical actions and LOINC assays are absent rather than empty: a gene has no
 * such field, so the page omits those sections entirely - see
 * `docs/adr/0001-HPO-68-unified-entity-page.md`.
 *
 * @param viewModel The resolved gene page data.
 * @returns Panel-menu items in the order the sections appear on the page.
 */
export function buildGenePageSections(viewModel: GenePageViewModel): PanelMenuItem[] {
  return [
    { id: 'summary', label: 'Summary', anchor: 'summary' },
    {
      id: 'phenotype-associations',
      label: 'Phenotype Associations',
      anchor: 'phenotype-associations',
      count: viewModel.phenotypeAssoc.length,
    },
    {
      id: 'disease-associations',
      label: 'Disease Associations',
      anchor: 'disease-associations',
      count: viewModel.diseaseAssoc.length,
    },
  ];
}
