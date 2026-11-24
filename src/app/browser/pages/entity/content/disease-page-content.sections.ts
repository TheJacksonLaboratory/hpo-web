import { PanelMenuItem } from '../../../models/models';
import { DiseasePageViewModel } from '../entity-page.types';

/**
 * Section config for the disease page. Each `anchor` must match an `anchorId`
 * in `disease-page-content.component.html`.
 *
 * @param viewModel The resolved disease page data.
 * @returns Panel-menu items in the order the sections appear on the page.
 */
export function buildDiseasePageSections(viewModel: DiseasePageViewModel): PanelMenuItem[] {
  return [
    { id: 'summary', label: 'Summary', anchor: 'summary' },
    {
      id: 'phenotype-associations',
      label: 'Phenotype Associations',
      anchor: 'phenotype-associations',
      count: viewModel.phenotypeAssoc.length,
    },
    {
      id: 'gene-associations',
      label: 'Gene Associations',
      anchor: 'gene-associations',
      count: viewModel.geneAssoc.length,
    },
  ];
}
