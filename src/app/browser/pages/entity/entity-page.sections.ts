import { EntityType, PanelMenuItem } from '../../models/models';
import { EntityPageViewModel, TermPageViewModel } from './entity-page.types';

/**
 * Builds the "On this page" items for whichever entity page is being rendered.
 *
 * A type's section config is the single place that decides which sections
 * exist for it. Data an entity type does not have is expressed by omitting the
 * section entirely, not by listing it and rendering a permanent empty state -
 * see `docs/adr/0001-HPO-68-unified-entity-page.md`.
 *
 * @param viewModel The resolved view model, narrowed by its `kind` discriminant.
 * @returns Panel-menu items in the order the sections appear on the page.
 */
export function buildSections(viewModel: EntityPageViewModel): PanelMenuItem[] {
  switch (viewModel.kind) {
    case EntityType.PHENOTYPE:
      return buildTermPageSections(viewModel);
  }
}

/**
 * Section config for the phenotype page: a summary anchor followed by the four
 * association sections.
 *
 * Summary is always enabled and always first. Each association section reports
 * its row count and is disabled when it has none; empty sections are listed
 * after the populated ones, matching where they render on the page.
 */
export function buildTermPageSections(viewModel: TermPageViewModel): PanelMenuItem[] {
  const [summary, ...associations] = [
    { id: 'summary', label: 'Summary', anchor: 'summary' },
    // Examples has no backing field on `Term` at all, so it is always empty
    // and always disabled. It is listed because the approved design carries it
    // - see the 2026-09-02 amendment in
    // `docs/adr/0001-HPO-68-unified-entity-page.md`, which this overrides.
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

  // Empty sections sink to the bottom, in their canonical order relative to
  // each other. AssociationsTableBlockComponent applies the same rule to the
  // rendered sections via `order-last`, so panel and page stay in step.
  return [
    summary,
    ...associations.filter((section) => !section.disabled),
    ...associations.filter((section) => section.disabled),
  ];
}
