import { EntityType } from '../../models/models';
import { buildSections } from './entity-page.sections';
import { buildTermPageSections } from './content/term-page-content.sections';
import { buildGenePageSections } from './content/gene-page-content.sections';
import { buildDiseasePageSections } from './content/disease-page-content.sections';
import { DiseasePageViewModel, GenePageViewModel, TermPageViewModel } from './entity-page.types';

describe('buildSections', () => {
  const termViewModel: TermPageViewModel = {
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
    networkError: false,
    languages: [],
  };

  const geneViewModel: GenePageViewModel = {
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

  it('dispatches a phenotype view model to the term page section config', () => {
    expect(buildSections(termViewModel)).toEqual(buildTermPageSections(termViewModel));
  });

  it('dispatches a gene view model to the gene page section config', () => {
    expect(buildSections(geneViewModel)).toEqual(buildGenePageSections(geneViewModel));
  });

  const diseaseViewModel: DiseasePageViewModel = {
    kind: EntityType.DISEASE,
    id: 'OMIM:254940',
    title: 'Carey-Fineman-Ziter syndrome',
    downloadCounts: { genes: 0, terms: 0 },
    disease: { id: 'OMIM:254940', name: 'Carey-Fineman-Ziter syndrome' },
    phenotypeAssoc: [],
    geneAssoc: [],
    networkError: false,
  };

  it('dispatches a disease view model to the disease page section config', () => {
    expect(buildSections(diseaseViewModel)).toEqual(buildDiseasePageSections(diseaseViewModel));
  });
});
