import { EntityType } from '../../../models/models';
import { buildDiseasePageSections } from './disease-page-content.sections';
import { DiseasePageViewModel } from '../entity-page.types';

describe('buildDiseasePageSections', () => {
  const baseViewModel: DiseasePageViewModel = {
    kind: EntityType.DISEASE,
    id: 'OMIM:254940',
    title: 'Carey-Fineman-Ziter syndrome',
    downloadCounts: { genes: 0, terms: 0 },
    disease: { id: 'OMIM:254940', name: 'Carey-Fineman-Ziter syndrome' },
    phenotypeAssoc: [],
    geneAssoc: [],
    networkError: false,
  };

  it('lists summary, phenotype and gene sections in page order', () => {
    expect(buildDiseasePageSections(baseViewModel).map((s) => s.id)).toEqual([
      'summary',
      'phenotype-associations',
      'gene-associations',
    ]);
  });

  it('omits medical actions and LOINC', () => {
    const ids = buildDiseasePageSections(baseViewModel).map((s) => s.id);
    expect(ids).not.toContain('medical-actions');
    expect(ids).not.toContain('loinc-associations');
  });

  it('zero-counts an empty section, leaving it navigable', () => {
    expect(buildDiseasePageSections(baseViewModel).find((s) => s.id === 'gene-associations')).toEqual({
      id: 'gene-associations',
      label: 'Gene Associations',
      anchor: 'gene-associations',
      count: 0,
    });
  });

  it('counts phenotype rows rather than body systems', () => {
    const viewModel: DiseasePageViewModel = {
      ...baseViewModel,
      phenotypeAssoc: [
        { id: 'HP:0004322', name: 'Short stature', category: 'Growth', categoryCount: 2, onset: '-', frequency: 'Frequent', sources: [] },
        { id: 'HP:0001510', name: 'Growth delay', category: 'Growth', categoryCount: 2, onset: '-', frequency: 'Frequent', sources: [] },
        { id: 'HP:0000252', name: 'Microcephaly', category: 'Head and neck', categoryCount: 1, onset: '-', frequency: '-', sources: [] },
      ],
    };

    expect(buildDiseasePageSections(viewModel).find((s) => s.id === 'phenotype-associations')!.count).toBe(3);
  });
});
