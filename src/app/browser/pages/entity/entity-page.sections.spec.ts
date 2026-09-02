import { EntityType } from '../../models/models';
import { buildSections, buildTermPageSections } from './entity-page.sections';
import { TermPageViewModel } from './entity-page.types';

describe('buildTermPageSections', () => {
  const baseViewModel: TermPageViewModel = {
    kind: EntityType.PHENOTYPE,
    id: 'HP:0001250',
    title: 'Seizure',
    downloadCounts: { diseases: 0, genes: 0 },
    paramId: 'HP:0001250',
    term: { id: 'HP:0001250', name: 'Seizure', synonyms: [] },
    treeData: { parents: [], children: [] },
    diseaseAssoc: [],
    geneAssoc: [],
    medicalActions: [],
    loincAssoc: [],
    publications: [],
    languages: [],
    networkError: false,
  };

  it('always includes a non-disableable Summary anchor first', () => {
    const sections = buildTermPageSections(baseViewModel);
    expect(sections[0]).toEqual({ id: 'summary', label: 'Summary', anchor: 'summary' });
  });

  it('disables and zero-counts a section with no rows', () => {
    const sections = buildTermPageSections(baseViewModel);
    const diseaseSection = sections.find((s) => s.id === 'disease-associations');
    expect(diseaseSection).toEqual({
      id: 'disease-associations',
      label: 'Disease Associations',
      anchor: 'disease-associations',
      count: 0,
      disabled: true,
    });
  });

  it('enables a section and reports its count when rows are present', () => {
    const viewModel: TermPageViewModel = {
      ...baseViewModel,
      geneAssoc: [{ id: 'NCBIGene:672', name: 'BRCA1' }],
    };

    const geneSection = buildTermPageSections(viewModel).find((s) => s.id === 'gene-associations');
    expect(geneSection).toEqual({
      id: 'gene-associations',
      label: 'Gene Associations',
      anchor: 'gene-associations',
      count: 1,
      disabled: false,
    });
  });

  it('always disables Examples, which has no backing field at all', () => {
    const withRows: TermPageViewModel = {
      ...baseViewModel,
      diseaseAssoc: [{ id: 'OMIM:1', name: 'D' }],
      publications: [{ id: 'PMID:1' }],
    };
    const examples = buildTermPageSections(withRows).find((s) => s.id === 'examples');
    expect(examples).toEqual({ id: 'examples', label: 'Examples', anchor: 'examples', count: 0, disabled: true });
  });

  it('counts publications from the term and enables the section when it has any', () => {
    const withPubs: TermPageViewModel = {
      ...baseViewModel,
      publications: [{ id: 'PMID:1' }, { id: 'PMID:2' }],
    };
    expect(buildTermPageSections(withPubs).find((s) => s.id === 'publications')).toEqual({
      id: 'publications',
      label: 'Publications',
      anchor: 'publications',
      count: 2,
      disabled: false,
    });
  });

  it('keeps the gene label plain - "inferred" is explained in the section description', () => {
    const gene = buildTermPageSections(baseViewModel).find((s) => s.id === 'gene-associations');
    expect(gene!.label).toBe('Gene Associations');
  });

  it('sinks empty sections below populated ones, keeping canonical order within each group', () => {
    const viewModel: TermPageViewModel = {
      ...baseViewModel,
      diseaseAssoc: [{ id: 'OMIM:1', name: 'D' }],
      medicalActions: [{ id: 'MAXO:1', name: 'M', relations: [], sources: [] }],
    };

    expect(buildTermPageSections(viewModel).map((s) => s.id)).toEqual([
      'summary',
      // populated, in canonical order
      'disease-associations',
      'medical-actions',
      // empty, in canonical order
      'examples',
      'gene-associations',
      'loinc-associations',
      'publications',
    ]);
  });

  it('keeps summary first even when every association section is empty', () => {
    expect(buildTermPageSections(baseViewModel)[0].id).toBe('summary');
  });

  it('produces one entry per association section plus summary', () => {
    const sections = buildTermPageSections(baseViewModel);
    expect(sections.map((s) => s.id)).toEqual([
      'summary',
      'examples',
      'disease-associations',
      'gene-associations',
      'medical-actions',
      'loinc-associations',
      'publications',
    ]);
  });

  it('is what buildSections dispatches to for a phenotype view model', () => {
    expect(buildSections(baseViewModel)).toEqual(buildTermPageSections(baseViewModel));
  });
});
