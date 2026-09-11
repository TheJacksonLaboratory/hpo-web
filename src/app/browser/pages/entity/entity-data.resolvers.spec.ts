import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { EntityType, Term } from '../../models/models';
import { AnnotationService } from '../../services/annotation/annotation.service';
import { OntologyService } from '../../services/ontology/ontology.service';
import { LanguageService } from '../../services/language/language.service';
import { GeneService } from '../../services/gene/gene.service';
import { EntityDataResolverService } from './entity-data.resolvers';
import { DiseasePageViewModel, GenePageViewModel, TermPageViewModel } from './entity-page.types';

describe('EntityDataResolverService', () => {
  let service: EntityDataResolverService;
  let ontologyService: any;
  let annotationService: any;
  let geneService: any;
  let languageService: LanguageService;

  const baseTerm: Term = {
    id: 'HP:0001250',
    name: 'Seizure',
    synonyms: [],
    comment: null,
    definition: null,
    xrefs: null,
    descendantCount: 4,
    publicationReferences: [],
    translations: [],
  };

  beforeEach(() => {
    ontologyService = {
      term: jest.fn(),
      parents: jest.fn().mockReturnValue(of([])),
      children: jest.fn().mockReturnValue(of([])),
    };
    annotationService = {
      fromPhenotype: jest.fn(),
      fromGene: jest.fn(),
      fromDisease: jest.fn(),
    };
    geneService = {
      searchGeneInfo: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        EntityDataResolverService,
        { provide: OntologyService, useValue: ontologyService },
        { provide: AnnotationService, useValue: annotationService },
        { provide: GeneService, useValue: geneService },
        LanguageService,
      ],
    });

    service = TestBed.inject(EntityDataResolverService);
    languageService = TestBed.inject(LanguageService);
  });


  it('errors for an entity type with no registered resolver', (done) => {
    service.resolve(-1 as EntityType, 'HP:0001250').subscribe({
      error: (err) => {
        expect(err.message).toContain('No entity-page resolver registered');
        done();
      },
    });
  });

  it('propagates a "not found" error when the term lookup returns nothing', (done) => {
    ontologyService.term.mockReturnValue(of(undefined));

    service.resolve(EntityType.PHENOTYPE, 'HP:9999999').subscribe({
      error: (err) => {
        expect(err.message).toContain('Could not find requested HP:9999999');
        done();
      },
    });
  });

  it('defaults comment/definition/xrefs and marks synonyms with a placeholder when empty', (done) => {
    ontologyService.term.mockReturnValue(of({ ...baseTerm }));
    annotationService.fromPhenotype.mockReturnValue(
      of({ diseases: [], genes: [], assays: [], medicalActions: [] }),
    );

    service.resolve(EntityType.PHENOTYPE, 'HP:0001250').subscribe((vm: TermPageViewModel) => {
      expect(vm.term.comment).toBe('');
      expect(vm.term.definition).toBe('Sorry this term has no definition.');
      expect(vm.term.xrefs).toEqual([]);
      expect(vm.term.synonyms).toEqual(['No synonyms found for this term.']);
      expect(vm.networkError).toBe(false);
      done();
    });
  });

  it('maps the term\'s PMID list into the publications section', (done) => {
    ontologyService.term.mockReturnValue(
      of({ ...baseTerm, publicationReferences: ['PMID:12345678', 'PMID:87654321'] }),
    );
    annotationService.fromPhenotype.mockReturnValue(
      of({ diseases: [], genes: [], assays: [], medicalActions: [] }),
    );

    service.resolve(EntityType.PHENOTYPE, 'HP:0001250').subscribe((vm: TermPageViewModel) => {
      expect(vm.publications).toEqual([{ id: 'PMID:12345678' }, { id: 'PMID:87654321' }]);
      done();
    });
  });

  it('yields no publications when the term cites none', (done) => {
    ontologyService.term.mockReturnValue(of({ ...baseTerm, publicationReferences: undefined }));
    annotationService.fromPhenotype.mockReturnValue(
      of({ diseases: [], genes: [], assays: [], medicalActions: [] }),
    );

    service.resolve(EntityType.PHENOTYPE, 'HP:0001250').subscribe((vm: TermPageViewModel) => {
      expect(vm.publications).toEqual([]);
      done();
    });
  });

  it('derives the shell fields (kind, id, title, downloadCounts) from the resolved entity', (done) => {
    ontologyService.term.mockReturnValue(of({ ...baseTerm }));
    annotationService.fromPhenotype.mockReturnValue(
      of({
        diseases: [{ id: 'OMIM:100100', name: 'Test disease' }],
        genes: [{ id: 'NCBIGene:672', name: 'BRCA1' }, { id: 'NCBIGene:675', name: 'BRCA2' }],
        assays: [],
        medicalActions: [],
      }),
    );

    service.resolve(EntityType.PHENOTYPE, 'HP:0001250').subscribe((vm: TermPageViewModel) => {
      expect(vm.kind).toBe(EntityType.PHENOTYPE);
      expect(vm.id).toBe('HP:0001250');
      expect(vm.title).toBe('Seizure');
      expect(vm.downloadCounts).toEqual({ diseases: 1, genes: 2 });
      done();
    });
  });

  it('reports the resolved id, not the requested one, when a term redirects', (done) => {
    // The API resolves an obsolete id to its replacement; `paramId` keeps what
    // was asked for so the header can show the "was X" trail.
    ontologyService.term.mockReturnValue(of({ ...baseTerm, id: 'HP:0001250', name: 'Seizure' }));
    annotationService.fromPhenotype.mockReturnValue(
      of({ diseases: [], genes: [], assays: [], medicalActions: [] }),
    );

    service.resolve(EntityType.PHENOTYPE, 'HP:0002331').subscribe((vm: TermPageViewModel) => {
      expect(vm.paramId).toBe('HP:0002331');
      expect(vm.id).toBe('HP:0001250');
      done();
    });
  });

  it('still derives the shell fields when the annotation call fails', (done) => {
    ontologyService.term.mockReturnValue(of({ ...baseTerm }));
    annotationService.fromPhenotype.mockReturnValue(throwError(() => new Error('network down')));

    service.resolve(EntityType.PHENOTYPE, 'HP:0001250').subscribe((vm: TermPageViewModel) => {
      expect(vm.kind).toBe(EntityType.PHENOTYPE);
      expect(vm.id).toBe('HP:0001250');
      expect(vm.title).toBe('Seizure');
      expect(vm.downloadCounts).toEqual({ diseases: 0, genes: 0 });
      done();
    });
  });

  it('maps association fields and flags networkError without failing the whole page when annotations fail', (done) => {
    ontologyService.term.mockReturnValue(of({ ...baseTerm }));
    annotationService.fromPhenotype.mockReturnValue(throwError(() => new Error('network down')));

    service.resolve(EntityType.PHENOTYPE, 'HP:0001250').subscribe((vm: TermPageViewModel) => {
      expect(vm.networkError).toBe(true);
      expect(vm.diseaseAssoc).toEqual([]);
      expect(vm.geneAssoc).toEqual([]);
      expect(vm.medicalActions).toEqual([]);
      expect(vm.loincAssoc).toEqual([]);
      // the term itself still resolved, even though the annotation call failed
      expect(vm.term.id).toBe('HP:0001250');
      done();
    });
  });

  it('deduplicates languages by (language, language_long) and always includes the default first', (done) => {
    ontologyService.term.mockReturnValue(
      of({
        ...baseTerm,
        // OntologyService.term() lowercases `language` before this resolver ever
        // sees it - two rows here simulate separate translated fields (name,
        // definition) for the same language, which must collapse to one entry.
        translations: [
          { language: 'fr', language_long: 'French', id: 't1', name: 'nom', status: 'ok' },
          { language: 'fr', language_long: 'French', id: 't2', name: 'nom2', status: 'ok' },
          { language: 'de', language_long: 'German', id: 't3', name: 'name', status: 'ok' },
        ],
      }),
    );
    annotationService.fromPhenotype.mockReturnValue(
      of({ diseases: [], genes: [], assays: [], medicalActions: [] }),
    );

    service.resolve(EntityType.PHENOTYPE, 'HP:0001250').subscribe((vm: TermPageViewModel) => {
      expect(vm.languages).toEqual([
        languageService.default,
        { language: 'fr', language_long: 'French' },
        { language: 'de', language_long: 'German' },
      ]);
      done();
    });
  });

  it('sorts children by descendantCount descending and computes proportional bar width/margin', (done) => {
    ontologyService.term.mockReturnValue(of({ ...baseTerm, descendantCount: 10 }));
    ontologyService.children.mockReturnValue(
      of([
        { id: 'HP:1', name: 'small', descendantCount: 2 },
        { id: 'HP:2', name: 'big', descendantCount: 8 },
      ]),
    );
    annotationService.fromPhenotype.mockReturnValue(
      of({ diseases: [], genes: [], assays: [], medicalActions: [] }),
    );

    service.resolve(EntityType.PHENOTYPE, 'HP:0001250').subscribe((vm: TermPageViewModel) => {
      expect(vm.treeData.children.map((c) => c.id)).toEqual(['HP:2', 'HP:1']);
      expect(vm.treeData.children[0].treeCountWidth).toBe(32); // 8/10 * 40 (MAX_TREE_WIDTH)
      expect(vm.treeData.children[1].treeCountWidth).toBe(8); // 2/10 * 40
      done();
    });
  });

  describe('gene', () => {
    const ENTREZ = {
      uid: '1497',
      name: 'CTNS',
      maplocation: '17p13.2',
      summary: 'This gene encodes a seven-transmembrane domain protein.',
      otheraliases: 'CTNS-LSB, PQLC4, SLC66A4',
    };
    const ASSOCIATIONS = {
      phenotypes: [{ id: 'HP:0001250', name: 'Seizure' }],
      diseases: [{ id: 'OMIM:219800', name: 'Cystinosis', mondoId: 'MONDO:0009244', description: '' }],
    };

    const resolveGene = (done: jest.DoneCallback, assert: (vm: GenePageViewModel) => void) =>
      service.resolve(EntityType.GENE, 'NCBIGene:1497').subscribe((viewModel) => {
        assert(viewModel as GenePageViewModel);
        done();
      });

    it('looks the Entrez record up by bare uid and reads it back out of the keyed map', (done) => {
      geneService.searchGeneInfo.mockReturnValue(of({ result: { '1497': ENTREZ } }));
      annotationService.fromGene.mockReturnValue(of(ASSOCIATIONS));

      resolveGene(done, (vm) => {
        expect(geneService.searchGeneInfo).toHaveBeenCalledWith('1497');
        expect(annotationService.fromGene).toHaveBeenCalledWith('NCBIGene:1497');
        expect(vm.gene.name).toBe('CTNS');
        expect(vm.gene.maplocation).toBe('17p13.2');
      });
    });

    it('splits the comma-joined aliases into synonyms', (done) => {
      geneService.searchGeneInfo.mockReturnValue(of({ result: { '1497': ENTREZ } }));
      annotationService.fromGene.mockReturnValue(of(ASSOCIATIONS));

      resolveGene(done, (vm) => expect(vm.gene.aliases).toEqual(['CTNS-LSB', 'PQLC4', 'SLC66A4']));
    });

    it('derives the shell inputs the page chrome reads', (done) => {
      geneService.searchGeneInfo.mockReturnValue(of({ result: { '1497': ENTREZ } }));
      annotationService.fromGene.mockReturnValue(of(ASSOCIATIONS));

      resolveGene(done, (vm) => {
        expect(vm.kind).toBe(EntityType.GENE);
        expect(vm.id).toBe('NCBIGene:1497');
        expect(vm.title).toBe('CTNS');
        expect(vm.downloadCounts).toEqual({ diseases: 1, terms: 1 });
      });
    });

    it('keeps the associations when the Entrez lookup fails', (done) => {
      geneService.searchGeneInfo.mockReturnValue(throwError(() => new Error('entrez down')));
      annotationService.fromGene.mockReturnValue(of(ASSOCIATIONS));

      resolveGene(done, (vm) => {
        expect(vm.entrezError).toBe(true);
        expect(vm.networkError).toBe(false);
        expect(vm.phenotypeAssoc).toHaveLength(1);
        expect(vm.title).toBe('NCBIGene:1497'); // falls back to the id
        expect(vm.gene.summary).toBe('No Entrez definition entry.');
      });
    });

    it('keeps the Entrez summary when the annotation call fails', (done) => {
      geneService.searchGeneInfo.mockReturnValue(of({ result: { '1497': ENTREZ } }));
      annotationService.fromGene.mockReturnValue(throwError(() => new Error('network down')));

      resolveGene(done, (vm) => {
        expect(vm.networkError).toBe(true);
        expect(vm.entrezError).toBe(false);
        expect(vm.gene.name).toBe('CTNS');
        expect(vm.phenotypeAssoc).toEqual([]);
        expect(vm.diseaseAssoc).toEqual([]);
        expect(vm.downloadCounts).toEqual({ diseases: 0, terms: 0 });
      });
    });

    it('resolves rather than erroring when an unknown uid returns no record', (done) => {
      geneService.searchGeneInfo.mockReturnValue(of({ result: {} }));
      annotationService.fromGene.mockReturnValue(of({ phenotypes: [], diseases: [] }));

      resolveGene(done, (vm) => {
        expect(vm.entrezError).toBe(true);
        expect(vm.gene.aliases).toEqual([]);
        expect(vm.gene.maplocation).toBe('');
      });
    });
  });

  describe('disease', () => {
    const DISEASE = { id: 'OMIM:254940', name: 'Carey-Fineman-Ziter syndrome', mondoId: 'MONDO:0031415' };

    const association = (categories: object, genes: any[] = []) => ({
      disease: DISEASE,
      categories,
      genes,
      medicalActions: [],
    });

    const phenotype = (id: string, name: string, metadata: object = {}) => ({ id, name, metadata });

    const resolveDisease = (done: jest.DoneCallback, assert: (vm: DiseasePageViewModel) => void) =>
      service.resolve(EntityType.DISEASE, 'OMIM:254940').subscribe((viewModel) => {
        assert(viewModel as DiseasePageViewModel);
        done();
      });

    it('flattens the category map into rows tagged with their body system', (done) => {
      annotationService.fromDisease.mockReturnValue(
        of(association({ Growth: [phenotype('HP:0004322', 'Short stature')] })),
      );

      resolveDisease(done, (vm) => {
        expect(vm.phenotypeAssoc).toHaveLength(1);
        expect(vm.phenotypeAssoc[0]).toEqual({
          id: 'HP:0004322',
          name: 'Short stature',
          category: 'Growth',
          categoryCount: 1,
          onset: '-',
          frequency: '-',
          sources: ['OMIM:254940'],
        });
      });
    });

    it('orders body systems by the canonical list, not alphabetically', (done) => {
      annotationService.fromDisease.mockReturnValue(
        of(
          association({
            'Nervous System': [phenotype('HP:0001250', 'Seizure')],
            Growth: [phenotype('HP:0004322', 'Short stature')],
            Inheritance: [phenotype('HP:0000007', 'Autosomal recessive inheritance')],
          }),
        ),
      );

      resolveDisease(done, (vm) => {
        expect(vm.phenotypeAssoc.map((row) => row.category)).toEqual([
          'Inheritance',
          'Growth',
          'Nervous System',
        ]);
      });
    });

    it('keeps rows of one body system adjacent, which is what the table groups on', (done) => {
      annotationService.fromDisease.mockReturnValue(
        of(
          association({
            Growth: [phenotype('HP:0004322', 'Short stature'), phenotype('HP:0001510', 'Growth delay')],
            Eye: [phenotype('HP:0000505', 'Visual impairment')],
          }),
        ),
      );

      resolveDisease(done, (vm) => {
        expect(vm.phenotypeAssoc.map((row) => row.category)).toEqual(['Growth', 'Growth', 'Eye']);
        expect(vm.phenotypeAssoc[0].categoryCount).toBe(2);
      });
    });

    it('sorts an unrecognised body system last rather than dropping it', (done) => {
      annotationService.fromDisease.mockReturnValue(
        of(
          association({
            'Some New Category': [phenotype('HP:9999999', 'Unknown')],
            Growth: [phenotype('HP:0004322', 'Short stature')],
          }),
        ),
      );

      resolveDisease(done, (vm) =>
        expect(vm.phenotypeAssoc.map((row) => row.category)).toEqual(['Growth', 'Some New Category']),
      );
    });

    it('skips a body system with no phenotypes', (done) => {
      annotationService.fromDisease.mockReturnValue(
        of(association({ Growth: [], Eye: [phenotype('HP:0000505', 'Visual impairment')] })),
      );

      resolveDisease(done, (vm) => expect(vm.phenotypeAssoc.map((row) => row.category)).toEqual(['Eye']));
    });

    it('keeps the annotation metadata and its own sources when present', (done) => {
      annotationService.fromDisease.mockReturnValue(
        of(
          association({
            Growth: [
              phenotype('HP:0004322', 'Short stature', {
                onset: 'Childhood onset',
                frequency: 'Frequent',
                sources: ['PMID:12345678'],
              }),
            ],
          }),
        ),
      );

      resolveDisease(done, (vm) => {
        expect(vm.phenotypeAssoc[0].onset).toBe('Childhood onset');
        expect(vm.phenotypeAssoc[0].frequency).toBe('Frequent');
        expect(vm.phenotypeAssoc[0].sources).toEqual(['PMID:12345678']);
      });
    });

    it('derives the shell inputs the page chrome reads', (done) => {
      annotationService.fromDisease.mockReturnValue(
        of(
          association({ Growth: [phenotype('HP:0004322', 'Short stature'), phenotype('HP:0001510', 'Growth delay')] }, [
            { id: 'NCBIGene:389827', name: 'MYMK' },
          ]),
        ),
      );

      resolveDisease(done, (vm) => {
        expect(vm.kind).toBe(EntityType.DISEASE);
        expect(vm.id).toBe('OMIM:254940');
        expect(vm.title).toBe('Carey-Fineman-Ziter syndrome');
        expect(vm.downloadCounts).toEqual({ genes: 1, terms: 2 });
        expect(vm.geneAssoc).toHaveLength(1);
      });
    });

    it('errors the route when the annotation call fails', (done) => {
      annotationService.fromDisease.mockReturnValue(throwError(() => new Error('network down')));

      service.resolve(EntityType.DISEASE, 'OMIM:254940').subscribe({
        error: (err) => {
          expect(err.message).toContain('Could not find requested OMIM:254940');
          done();
        },
      });
    });
  });
});
