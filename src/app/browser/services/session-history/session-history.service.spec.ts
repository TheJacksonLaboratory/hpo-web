import { TestBed } from '@angular/core/testing';
import { NavigationCancel, NavigationError, NavigationSkipped, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { EntityType } from '../../models/models';
import { SessionHistoryService } from './session-history.service';
import { SessionStep, SessionTrail } from './session-history.types';

const STORAGE_KEY = 'hpo.sessionHistory';

const hypertension: SessionStep = { entityType: EntityType.PHENOTYPE, id: 'HP:0000822', label: 'Hypertension' };
const ptbp1: SessionStep = { entityType: EntityType.GENE, id: 'NCBIGene:5725', label: 'PTBP1' };
const labile: SessionStep = { entityType: EntityType.PHENOTYPE, id: 'HP:0031992', label: 'Labile Hypertension' };
const diabetes: SessionStep = { entityType: EntityType.DISEASE, id: 'MONDO:0005015', label: 'Diabetes' };

/** A trail of the given steps with the last one current. */
function trailOf(...steps: SessionStep[]): SessionTrail {
  return { steps, current: steps.length - 1 };
}

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

    expect(service.trail()).toEqual({ steps: [hypertension], current: 0 });
  });

  it('appends when the previous URL is an entity page', () => {
    const service = create(trailOf(hypertension));
    navigateFrom('/term/HP:0000822');
    service.record(ptbp1);

    expect(service.trail()).toEqual(trailOf(hypertension, ptbp1));
  });

  it('starts a new trail when the previous URL is search', () => {
    const service = create(trailOf(hypertension, ptbp1));
    navigateFrom('/search?q=pressure');
    service.record(diabetes);

    expect(service.trail()).toEqual(trailOf(diabetes));
  });

  it('starts a new trail when a different entity is loaded with no previous URL', () => {
    const service = create(trailOf(hypertension, ptbp1));
    navigateFrom('/');
    service.record(diabetes);

    expect(service.trail()).toEqual(trailOf(diabetes));
  });

  it('does nothing when the current entity is recorded again', () => {
    const service = create({ steps: [hypertension, ptbp1], current: 0 });
    navigateFrom('/');
    service.record(hypertension);

    expect(service.trail()).toEqual({ steps: [hypertension, ptbp1], current: 0 });
  });

  it('goTo navigates to the step without changing the trail until the page resolves', () => {
    const service = create(trailOf(hypertension, ptbp1, labile));
    service.goTo(1);

    expect(routerStub.navigate).toHaveBeenCalledWith(['/gene', 'NCBIGene:5725']);
    expect(service.trail()).toEqual(trailOf(hypertension, ptbp1, labile));
  });

  it('goTo then record of that step appends it at the end and makes it current', () => {
    const service = create(trailOf(hypertension, ptbp1, labile));
    service.goTo(1);
    navigateFrom('/term/HP:0031992');
    service.record(ptbp1);

    expect(service.trail()).toEqual(trailOf(hypertension, ptbp1, labile, ptbp1));
  });

  it('goTo to the same page as the last step makes the last step current without repeating it', () => {
    const service = create(trailOf(hypertension, ptbp1, hypertension));
    service.goTo(0);
    navigateFrom('/term/HP:0000822');
    service.record(hypertension);

    expect(service.trail()).toEqual(trailOf(hypertension, ptbp1, hypertension));
  });

  it('a link followed after goTo appends after the revisited page with nothing skipped', () => {
    const service = create(trailOf(hypertension, ptbp1, labile));
    service.goTo(0);
    navigateFrom('/term/HP:0031992');
    service.record(hypertension);
    navigateFrom('/term/HP:0000822');
    service.record(diabetes);

    expect(service.trail()).toEqual(trailOf(hypertension, ptbp1, labile, hypertension, diabetes));
  });

  it.each([
    ['skipped', () => new NavigationSkipped(1, '/term/HP:0000822', 'same url')],
    ['cancelled', () => new NavigationCancel(1, '/term/HP:0000822', 'guard')],
    ['failed', () => new NavigationError(1, '/term/HP:0000822', new Error('failed'))],
  ])('a goTo whose navigation is %s does not mark the next navigation', (_, ended) => {
    const service = create(trailOf(hypertension, ptbp1, hypertension));
    service.goTo(0);
    routerStub.events.next(ended());
    navigateFrom('/', 'popstate');

    expect(service.captureContext()?.goToIndex).toBeUndefined();
  });

  it('popstate to an entity in the trail makes its most recent step current', () => {
    const service = create(trailOf(hypertension, ptbp1, hypertension, labile));
    navigateFrom('/term/HP:0031992', 'popstate');
    service.record(hypertension);

    expect(service.trail()).toEqual({ steps: [hypertension, ptbp1, hypertension, labile], current: 2 });
  });

  it('popstate to an entity not in the trail appends it', () => {
    const service = create(trailOf(hypertension, ptbp1));
    navigateFrom('/gene/NCBIGene:5725', 'popstate');
    service.record(labile);

    expect(service.trail()).toEqual(trailOf(hypertension, ptbp1, labile));
  });

  it('record applies the captured context rather than a later navigation\'s', () => {
    const service = create({ steps: [hypertension, ptbp1], current: 1 });
    navigateFrom('/gene/NCBIGene:5725', 'popstate');
    const context = service.captureContext();
    navigateFrom('/gene/NCBIGene:5725');
    service.record(hypertension, context);

    expect(service.trail()).toEqual({ steps: [hypertension, ptbp1], current: 0 });
  });

  it('clear keeps only the page on screen', () => {
    const service = create({ steps: [hypertension, ptbp1, labile], current: 1 });
    service.clear();

    expect(service.trail()).toEqual(trailOf(ptbp1));
    expect(JSON.parse(sessionStorage.getItem(STORAGE_KEY) as string)).toEqual(trailOf(ptbp1));
  });

  it('persists the trail to sessionStorage', () => {
    const service = create();
    navigateFrom('/');
    service.record(hypertension);

    expect(JSON.parse(sessionStorage.getItem(STORAGE_KEY) as string)).toEqual({ steps: [hypertension], current: 0 });
  });

  it('hydrates a stored trail', () => {
    const service = create({ steps: [hypertension, ptbp1], current: 0 });

    expect(service.trail()).toEqual({ steps: [hypertension, ptbp1], current: 0 });
  });

  it('ignores malformed stored JSON', () => {
    expect(create('{not json').trail()).toEqual({ steps: [], current: -1 });
  });

  it('ignores a stored value that is not a trail', () => {
    expect(create([hypertension]).trail()).toEqual({ steps: [], current: -1 });
    expect(create({ steps: [{ entityType: 'gene', id: 5, label: null }], current: 0 }).trail()).toEqual({
      steps: [],
      current: -1,
    });
  });

  it('ignores a stored trail whose current index is outside it', () => {
    expect(create({ steps: [hypertension], current: 3 }).trail()).toEqual({ steps: [], current: -1 });
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

    expect(service.trail()).toEqual(trailOf(hypertension, ptbp1));
  });
});
