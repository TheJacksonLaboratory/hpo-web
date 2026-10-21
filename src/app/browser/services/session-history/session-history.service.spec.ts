import { TestBed } from '@angular/core/testing';
import { NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { EntityType } from '../../models/models';
import { SessionHistoryService } from './session-history.service';
import { SessionStep } from './session-history.types';

const STORAGE_KEY = 'hpo.sessionHistory';

const hypertension: SessionStep = { entityType: EntityType.PHENOTYPE, id: 'HP:0000822', label: 'Hypertension' };
const ptbp1: SessionStep = { entityType: EntityType.GENE, id: 'NCBIGene:5725', label: 'PTBP1' };
const labile: SessionStep = { entityType: EntityType.PHENOTYPE, id: 'HP:0031992', label: 'Labile Hypertension' };
const diabetes: SessionStep = { entityType: EntityType.DISEASE, id: 'MONDO:0005015', label: 'Diabetes' };

describe('SessionHistoryService', () => {
  let routerStub: { events: Subject<unknown>; url: string; navigate: jest.Mock };
  let navigationId: number;

  /** Builds the service after optionally seeding the stored trail. */
  function create(stored?: unknown): SessionHistoryService {
    if (stored !== undefined) {
      sessionStorage.setItem(STORAGE_KEY, typeof stored === 'string' ? stored : JSON.stringify(stored));
    }
    return TestBed.inject(SessionHistoryService);
  }

  /** Emits the NavigationStart the router sends when leaving `fromUrl`. */
  function navigateFrom(fromUrl: string, trigger: 'imperative' | 'popstate' = 'imperative'): void {
    routerStub.url = fromUrl;
    routerStub.events.next(new NavigationStart(++navigationId, '/next', trigger));
  }

  beforeEach(() => {
    sessionStorage.clear();
    navigationId = 0;
    routerStub = { events: new Subject(), url: '/', navigate: jest.fn().mockResolvedValue(true) };
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: routerStub }] });
  });

  afterEach(() => jest.restoreAllMocks());

  it('starts a trail on the first record', () => {
    const service = create();
    navigateFrom('/');
    service.record(hypertension);

    expect(service.steps()).toEqual([hypertension]);
  });

  it('appends when the previous URL is an entity page', () => {
    const service = create([hypertension]);
    navigateFrom('/term/HP:0000822');
    service.record(ptbp1);

    expect(service.steps()).toEqual([hypertension, ptbp1]);
  });

  it('starts a new trail when the previous URL is search', () => {
    const service = create([hypertension, ptbp1]);
    navigateFrom('/search?q=pressure');
    service.record(diabetes);

    expect(service.steps()).toEqual([diabetes]);
  });

  it('starts a new trail when a different entity is loaded with no previous URL', () => {
    const service = create([hypertension, ptbp1]);
    navigateFrom('/');
    service.record(diabetes);

    expect(service.steps()).toEqual([diabetes]);
  });

  it('does nothing when the same entity is recorded again', () => {
    const service = create([hypertension, ptbp1]);
    navigateFrom('/');
    service.record(ptbp1);

    expect(service.steps()).toEqual([hypertension, ptbp1]);
  });

  it('rewindTo cuts the trail and navigates to the clicked step', () => {
    const service = create([hypertension, ptbp1, labile]);
    service.rewindTo(1);

    expect(service.steps()).toEqual([hypertension, ptbp1]);
    expect(routerStub.navigate).toHaveBeenCalledWith(['/gene', 'NCBIGene:5725']);
  });

  it('rewindTo then record of the same step does not append', () => {
    const service = create([hypertension, ptbp1, labile]);
    service.rewindTo(1);
    navigateFrom('/term/HP:0031992');
    service.record(ptbp1);

    expect(service.steps()).toEqual([hypertension, ptbp1]);
  });

  it('a link followed after a rewind appends after the rewound step', () => {
    const service = create([hypertension, ptbp1, labile]);
    service.rewindTo(1);
    navigateFrom('/term/HP:0031992');
    service.record(ptbp1);
    navigateFrom('/gene/NCBIGene:5725');
    service.record(diabetes);

    expect(service.steps()).toEqual([hypertension, ptbp1, diabetes]);
  });

  it('popstate to an entity in the trail cuts to its most recent occurrence', () => {
    const service = create([hypertension, ptbp1, hypertension, labile]);
    navigateFrom('/term/HP:0031992', 'popstate');
    service.record(hypertension);

    expect(service.steps()).toEqual([hypertension, ptbp1, hypertension]);
  });

  it('popstate to an entity not in the trail appends it', () => {
    const service = create([hypertension, ptbp1]);
    navigateFrom('/gene/NCBIGene:5725', 'popstate');
    service.record(labile);

    expect(service.steps()).toEqual([hypertension, ptbp1, labile]);
  });

  it('persists the trail to sessionStorage', () => {
    const service = create();
    navigateFrom('/');
    service.record(hypertension);

    expect(JSON.parse(sessionStorage.getItem(STORAGE_KEY) as string)).toEqual([hypertension]);
  });

  it('hydrates a stored trail', () => {
    const service = create([hypertension, ptbp1]);

    expect(service.steps()).toEqual([hypertension, ptbp1]);
  });

  it('ignores malformed stored JSON', () => {
    expect(create('{not json').steps()).toEqual([]);
  });

  it('ignores a stored value that is not a list of steps', () => {
    expect(create([{ entityType: 'gene', id: 5, label: null }]).steps()).toEqual([]);
  });

  it('record applies the captured context rather than a later navigation\'s', () => {
    const service = create([hypertension, ptbp1]);
    navigateFrom('/gene/NCBIGene:5725', 'popstate');
    const context = service.captureContext();
    navigateFrom('/gene/NCBIGene:5725');
    service.record(hypertension, context);

    expect(service.steps()).toEqual([hypertension]);
  });

  it('works when sessionStorage throws', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const service = create();
    navigateFrom('/');
    service.record(hypertension);
    navigateFrom('/term/HP:0000822');
    service.record(ptbp1);

    expect(service.steps()).toEqual([hypertension, ptbp1]);
  });
});
