import { EntityType } from '../../../models/models';
import { buildGenePageSections } from './gene-page-content.sections';
import { GenePageViewModel } from '../entity-page.types';

describe('buildGenePageSections', () => {
  const baseViewModel: GenePageViewModel = {
    kind: EntityType.GENE,
    id: 'NCBIGene:1497',
    title: 'CTNS',
    downloadCounts: { diseases: 0, terms: 0 },
    gene: { uid: '1497', name: 'CTNS', maplocation: '17p13.2', summary: '', otheraliases: '', aliases: [] },
    phenotypeAssoc: [],
    diseaseAssoc: [],
    entrezError: false,
    networkError: false,
  };

  it('lists summary, phenotype and disease sections in page order', () => {
    expect(buildGenePageSections(baseViewModel).map((s) => s.id)).toEqual([
      'summary',
      'phenotype-associations',
      'disease-associations',
    ]);
  });

  it('omits medical actions and LOINC, which a gene has no field for', () => {
    const ids = buildGenePageSections(baseViewModel).map((s) => s.id);
    expect(ids).not.toContain('medical-actions');
    expect(ids).not.toContain('loinc-associations');
  });

  it('zero-counts an empty section, leaving it navigable', () => {
    const phenotypes = buildGenePageSections(baseViewModel).find((s) => s.id === 'phenotype-associations');
    expect(phenotypes).toEqual({
      id: 'phenotype-associations',
      label: 'Phenotype Associations',
      anchor: 'phenotype-associations',
      count: 0,
    });
  });

  it('reports each section count when rows are present', () => {
    const viewModel: GenePageViewModel = {
      ...baseViewModel,
      phenotypeAssoc: [{ id: 'HP:0001250', name: 'Seizure' }],
      diseaseAssoc: [
        { id: 'OMIM:219800', name: 'Cystinosis', mondoId: 'MONDO:0009244', description: '' },
        { id: 'ORPHA:213', name: 'Nephropathic cystinosis', mondoId: 'MONDO:0009243', description: '' },
      ],
    };

    const sections = buildGenePageSections(viewModel);
    expect(sections.find((s) => s.id === 'phenotype-associations')!.count).toBe(1);
    expect(sections.find((s) => s.id === 'disease-associations')!.count).toBe(2);
  });

  it('always includes a non-disableable Summary anchor first', () => {
    expect(buildGenePageSections(baseViewModel)[0]).toEqual({ id: 'summary', label: 'Summary', anchor: 'summary' });
  });
});
