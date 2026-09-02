import { PanelMenuItem } from '../../../models/models';
import { TermPageViewModel } from '../entity-page.types';

/**
 * Section config for the phenotype page. Each `anchor` must match an
 * `anchorId` in `term-page-content.component.html`.
 *
 * @param viewModel The resolved phenotype page data.
 * @returns Panel-menu items, summary first, then populated sections, then empty ones.
 */
export function buildTermPageSections(viewModel: TermPageViewModel): PanelMenuItem[] {
  const [summary, ...associations] = [
    { id: 'summary', label: 'Summary', anchor: 'summary' },
    { id: 'examples', label: 'Examples', anchor: 'examples', count: 0, disabled: true },
    {
      id: 'disease-associations',
      label: 'Disease Associations',
      anchor: 'disease-associations',
      count: viewModel.diseaseAssoc.length,
      disabled: viewModel.diseaseAssoc.length === 0,
    },
    {
      id: 'gene-associations',
      label: 'Gene Associations',
      anchor: 'gene-associations',
      count: viewModel.geneAssoc.length,
      disabled: viewModel.geneAssoc.length === 0,
    },
    {
      id: 'medical-actions',
      label: 'Medical Actions',
      anchor: 'medical-actions',
      count: viewModel.medicalActions.length,
      disabled: viewModel.medicalActions.length === 0,
    },
    {
      id: 'loinc-associations',
      label: 'LOINC Associations',
      anchor: 'loinc-associations',
      count: viewModel.loincAssoc.length,
      disabled: viewModel.loincAssoc.length === 0,
    },
    {
      id: 'publications',
      label: 'Publications',
      anchor: 'publications',
      count: viewModel.publications.length,
      disabled: viewModel.publications.length === 0,
    },
  ];

  return [
    summary,
    ...associations.filter((section) => !section.disabled),
    ...associations.filter((section) => section.disabled),
  ];
}
