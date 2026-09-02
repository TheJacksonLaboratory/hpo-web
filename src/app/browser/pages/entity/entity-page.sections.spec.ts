import { EntityType } from '../../models/models';
import { buildSections } from './entity-page.sections';
import { buildTermPageSections } from './content/term-page-content.sections';
import { TermPageViewModel } from './entity-page.types';

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

  it('dispatches a phenotype view model to the term page section config', () => {
    expect(buildSections(termViewModel)).toEqual(buildTermPageSections(termViewModel));
  });
});
