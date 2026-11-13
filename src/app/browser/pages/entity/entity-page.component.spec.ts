import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { NEVER, Subject, of, throwError } from 'rxjs';
import { JdsTermBrowserFacade } from '@jax-data-science/components';
import { EntityType, Language } from '../../models/models';
import { LanguageService } from '../../services/language/language.service';
import { SessionHistoryService } from '../../services/session-history/session-history.service';
import { EntityPageComponent } from './entity-page.component';
import { EntityDataResolverService } from './entity-data.resolvers';
import { GenePageViewModel, TermPageViewModel } from './entity-page.types';

describe('EntityPageComponent', () => {
  const english = { language: 'en' } as Language;
  const geneViewModel: GenePageViewModel = {
    kind: EntityType.GENE,
    id: 'NCBIGene:5725',
    title: 'PTBP1',
    downloadCounts: { diseases: 0, terms: 0 },
    gene: { uid: '5725', name: 'PTBP1', maplocation: '19p13.3', summary: '', otheraliases: '', aliases: [] },
    phenotypeAssoc: [],
    diseaseAssoc: [],
    entrezError: false,
    networkError: false,
  };

  let record: jest.Mock;
  let navigate: jest.Mock;
  let resolve: jest.Mock;
  let load: jest.Mock;

  const termViewModel: TermPageViewModel = {
    kind: EntityType.PHENOTYPE,
    id: 'HP:0001250',
    title: 'Seizure',
    downloadCounts: { diseases: 0, genes: 0 },
    paramId: 'HP:0001250',
    term: { id: 'HP:0001250', name: 'Seizure', synonyms: [] },
    diseaseAssoc: [],
    geneAssoc: [],
    medicalActions: [],
    loincAssoc: [],
    publications: [],
    languages: [],
    networkError: false,
  };

  const captured = { fromEntity: true, isPopstate: false, isRewind: false };

  function create() {
    TestBed.configureTestingModule({
      imports: [EntityPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: { entityType: EntityType.GENE } }, paramMap: of(convertToParamMap({ id: 'NCBIGene:5725' })) } },
        { provide: Router, useValue: { navigate } },
        { provide: EntityDataResolverService, useValue: { resolve } },
        { provide: JdsTermBrowserFacade, useValue: { load } },
        { provide: SessionHistoryService, useValue: { record, captureContext: () => captured } },
        {
          provide: LanguageService,
          useValue: { default: english, active$: of(english), languageSubject: { value: english } },
        },
      ],
    });
    TestBed.overrideComponent(EntityPageComponent, { set: { imports: [], template: '' } });
    const fixture = TestBed.createComponent(EntityPageComponent);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() => {
    record = jest.fn();
    navigate = jest.fn();
    resolve = jest.fn();
    load = jest.fn();
  });

  it("reports the resolved view model's type, id and title to the session history service", () => {
    resolve.mockReturnValue(of(geneViewModel));
    create();

    expect(record).toHaveBeenCalledWith({ entityType: EntityType.GENE, id: 'NCBIGene:5725', label: 'PTBP1' }, captured);
  });

  it('reports with the context captured when the resolve started', () => {
    const resolved = new Subject<GenePageViewModel>();
    resolve.mockReturnValue(resolved);
    const captureContext = jest.fn().mockReturnValue(captured);
    TestBed.overrideProvider(SessionHistoryService, { useValue: { record, captureContext } });
    create();

    expect(captureContext).toHaveBeenCalledTimes(1);
    captureContext.mockReturnValue({ ...captured, isPopstate: true });
    resolved.next(geneViewModel);

    expect(record).toHaveBeenCalledWith(expect.anything(), captured);
  });

  it('does not report after the page is destroyed', () => {
    const resolved = new Subject<GenePageViewModel>();
    resolve.mockReturnValue(resolved);
    create().destroy();
    resolved.next(geneViewModel);

    expect(record).not.toHaveBeenCalled();
  });

  it('does not report anything when the resolve errors', () => {
    resolve.mockReturnValue(throwError(() => new Error('not found')));
    create();

    expect(record).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/error'], expect.anything());
  });

  describe('hierarchy drawer', () => {
    it('starts closed', () => {
      resolve.mockReturnValue(NEVER);

      expect(create().componentInstance.treeOpen).toBe(false);
    });

    it('opens on openTree and closes on closeTree', () => {
      resolve.mockReturnValue(NEVER);
      const component = create().componentInstance;

      component.openTree();
      expect(component.treeOpen).toBe(true);

      component.closeTree();
      expect(component.treeOpen).toBe(false);
    });

    it('closes when Escape is pressed on the document', () => {
      resolve.mockReturnValue(NEVER);
      const component = create().componentInstance;
      component.openTree();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(component.treeOpen).toBe(false);
    });

    it('closes when the route navigates to another entity', () => {
      const params = new Subject<ReturnType<typeof convertToParamMap>>();
      resolve.mockReturnValue(NEVER);
      TestBed.overrideProvider(ActivatedRoute, {
        useValue: { snapshot: { data: { entityType: EntityType.PHENOTYPE } }, paramMap: params },
      });
      const component = create().componentInstance;
      component.openTree();

      params.next(convertToParamMap({ id: 'HP:0000822' }));

      expect(component.treeOpen).toBe(false);
    });
  });

  describe('term browser', () => {
    it('loads the hierarchy of a resolved phenotype', () => {
      resolve.mockReturnValue(of(termViewModel));
      create();

      expect(load).toHaveBeenCalledWith('HP:0001250');
    });

    it('does not load a hierarchy for a gene', () => {
      resolve.mockReturnValue(of(geneViewModel));
      create();

      expect(load).not.toHaveBeenCalled();
    });

    it('navigates to the term chosen in the browser', () => {
      resolve.mockReturnValue(NEVER);
      const component = create().componentInstance;

      component.onTermSelect({ term: { id: 'HP:0002133', name: 'Status epilepticus' }, path: ['HP:0000118', 'HP:0002133'] });

      expect(navigate).toHaveBeenCalledWith(['/term', 'HP:0002133']);
    });
  });
});
