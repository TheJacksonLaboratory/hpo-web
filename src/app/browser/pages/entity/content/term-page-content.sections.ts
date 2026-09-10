import { PanelMenuItem } from '../../../models/models';
import { TermPageViewModel } from '../entity-page.types';

/**
 * Section config for the phenotype page. Each `anchor` must match an
 * `anchorId` in `term-page-content.component.html`.
 *
 * @param viewModel The resolved phenotype page data.
 * @returns Panel-menu items in the order the sections appear on the page.
 */
export function buildTermPageSections(viewModel: TermPageViewModel): PanelMenuItem[] {
  return [
    { id: 'summary', label: 'Summary', anchor: 'summary' },
    { id: 'examples', label: 'Examples', anchor: 'examples', count: 0 },
    {
      id: 'disease-associations',
      label: 'Disease Associations',
      anchor: 'disease-associations',
      count: viewModel.diseaseAssoc.length,
    },
    {
      id: 'gene-associations',
      label: 'Gene Associations',
      anchor: 'gene-associations',
      count: viewModel.geneAssoc.length,
    },
    {
      id: 'medical-actions',
      label: 'Medical Actions',
      anchor: 'medical-actions',
      count: viewModel.medicalActions.length,
    },
    {
      id: 'loinc-associations',
      label: 'LOINC Associations',
      anchor: 'loinc-associations',
      count: viewModel.loincAssoc.length,
    },
    {
      id: 'publications',
      label: 'Publications',
      anchor: 'publications',
      count: viewModel.publications.length,
    },
  ];
}
