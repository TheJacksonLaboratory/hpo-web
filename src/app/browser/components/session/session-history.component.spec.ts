import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WritableSignal, signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { EntityType } from '../../models/models';
import { SessionHistoryService } from '../../services/session-history/session-history.service';
import { SessionStep, SessionTrail } from '../../services/session-history/session-history.types';
import { SessionHistoryComponent } from './session-history.component';

const hypertension: SessionStep = { entityType: EntityType.PHENOTYPE, id: 'HP:0000822', label: 'Hypertension' };
const ptbp1: SessionStep = { entityType: EntityType.GENE, id: 'NCBIGene:5725', label: 'PTBP1' };
const labile: SessionStep = { entityType: EntityType.PHENOTYPE, id: 'HP:0031992', label: 'Labile Hypertension' };
const diabetes: SessionStep = { entityType: EntityType.DISEASE, id: 'MONDO:0005015', label: 'Diabetes' };

const VISIBLE_ROW = 'ol:not([data-measure])';

/** Width in pixels reported for every measured step. */
const STEP_WIDTH = 100;

/** Width in pixels reported for every overflow button. */
const OVERFLOW_WIDTH = 40;

/** Builds `count` distinct phenotype steps labelled `Step 0..count-1`. */
function longSteps(count: number): SessionStep[] {
  return Array.from({ length: count }, (_, i) => ({ ...labile, id: `HP:${i}`, label: `Step ${i}` }));
}

/** A trail of the given steps with the last one current. */
function trailOf(...steps: SessionStep[]): SessionTrail {
  return { steps, current: steps.length - 1 };
}

describe('SessionHistoryComponent', () => {
  let fixture: ComponentFixture<SessionHistoryComponent>;
  let trail: WritableSignal<SessionTrail>;
  let goTo: jest.Mock;
  let clear: jest.Mock;
  let navWidth: number;

  /** Renders the component with the given trail, letting the width measurement settle. */
  function render(next: SessionTrail): HTMLElement {
    trail.set(next);
    fixture.detectChanges();
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  /** Describes the visible row: step labels, "[x]" for the current step, "<kind>..." for menu buttons. */
  function describeRow(el: HTMLElement): string[] {
    return Array.from(el.querySelectorAll(`${VISIBLE_ROW} > li`)).map((li) => {
      const kind = li.querySelector('button[data-kind]')?.getAttribute('data-kind');
      if (kind) {
        return `${kind}...`;
      }
      const label = (li.textContent ?? '').trim();
      return li.querySelector('[aria-current="page"]') ? `[${label}]` : label;
    });
  }

  beforeEach(async () => {
    trail = signal<SessionTrail>({ steps: [], current: -1 });
    goTo = jest.fn();
    clear = jest.fn();
    navWidth = 10000;
    jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (this: HTMLElement) {
      return this.hasAttribute('data-overflow') ? OVERFLOW_WIDTH : STEP_WIDTH;
    });
    jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => navWidth);
    await TestBed.configureTestingModule({
      imports: [SessionHistoryComponent],
      providers: [provideRouter([]), provideNoopAnimations(), { provide: SessionHistoryService, useValue: { trail, goTo, clear } }],
    }).compileComponents();
    fixture = TestBed.createComponent(SessionHistoryComponent);
  });

  afterEach(() => jest.restoreAllMocks());

  it('renders a nav landmark labelled "Session History"', () => {
    const nav = render(trailOf(hypertension)).querySelector('nav');

    expect(nav?.getAttribute('aria-label')).toBe('Session History');
    expect(nav?.textContent).toContain('Session History');
  });

  it('renders every step except the current one as a link', () => {
    const el = render({ steps: [hypertension, ptbp1, labile], current: 1 });
    const links = Array.from(el.querySelectorAll(`${VISIBLE_ROW} a`));

    expect(links.map((a) => a.textContent?.trim())).toEqual(['Hypertension', 'Labile Hypertension']);
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/term/HP:0000822', '/term/HP:0031992']);
  });

  it('renders the current step as plain text with aria-current page', () => {
    const el = render({ steps: [hypertension, ptbp1], current: 0 });
    const current = el.querySelector(`${VISIBLE_ROW} [aria-current="page"]`);

    expect(current?.textContent?.trim()).toBe('Hypertension');
    expect(current?.tagName).not.toBe('A');
  });

  it('shows a type icon on each step', () => {
    const el = render(trailOf(hypertension, ptbp1, diabetes));
    const icons = Array.from(el.querySelectorAll(`${VISIBLE_ROW} li > a > i, ${VISIBLE_ROW} li > [aria-current] > i`)).map(
      (i) => i.className,
    );

    expect(icons.length).toBe(3);
    expect(new Set(icons).size).toBe(3);
  });

  it('does not wrap the visible steps', () => {
    const el = render(trailOf(hypertension, ptbp1));

    expect(el.querySelector(VISIBLE_ROW)?.classList).toContain('flex-nowrap');
  });

  it('shows every step with no menu button when they all fit', () => {
    const el = render(trailOf(...longSteps(9)));

    expect(describeRow(el)).toEqual([
      'Step 0',
      'Step 1',
      'Step 2',
      'Step 3',
      'Step 4',
      'Step 5',
      'Step 6',
      'Step 7',
      '[Step 8]',
    ]);
  });

  it('puts the oldest steps behind a menu at the start when the newest step is current', () => {
    navWidth = 250;
    const el = render(trailOf(...longSteps(8)));

    expect(describeRow(el)).toEqual(['before...', 'Step 6', '[Step 7]']);
  });

  it('puts steps behind menus at both ends when the current step is in the middle', () => {
    navWidth = 450;
    const el = render({ steps: longSteps(9), current: 4 });

    expect(describeRow(el)).toEqual(['before...', 'Step 3', '[Step 4]', 'Step 5', 'after...']);
  });

  it('collapses steps left behind by a branch into a menu between the steps', () => {
    const steps = longSteps(5);
    steps[4] = { ...steps[4], skipped: 2 };
    const el = render({ steps, current: 4 });

    expect(describeRow(el)).toEqual(['Step 0', 'Step 1', 'gap...', '[Step 4]']);
  });

  it('keeps the current step visible however narrow the row is', () => {
    navWidth = 10;
    const el = render({ steps: longSteps(5), current: 2 });

    expect(describeRow(el)).toEqual(['before...', '[Step 2]', 'after...']);
  });

  it('gives each menu button an accessible name and marks it as opening a menu', () => {
    navWidth = 450;
    const buttons = Array.from(render({ steps: longSteps(9), current: 4 }).querySelectorAll('button[data-kind]'));

    expect(buttons.map((b) => b.getAttribute('aria-label'))).toEqual(['Show earlier steps', 'Show later steps']);
    expect(buttons.every((b) => b.getAttribute('aria-haspopup') === 'menu' && b.getAttribute('type') === 'button')).toBe(true);
  });

  it('opening a menu lists its hidden steps in trail order with their type icons', () => {
    navWidth = 250;
    const steps = [hypertension, ptbp1, diabetes, labile, hypertension, ptbp1, diabetes, labile];
    const el = render({ steps, current: 7 });
    (el.querySelector('button[data-kind="before"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    const items = fixture.componentInstance.menuItems();
    expect(items.map((item) => item.label)).toEqual(['Hypertension', 'PTBP1', 'Diabetes', 'Labile Hypertension', 'Hypertension', 'PTBP1']);
    expect(items.slice(0, 3).map((item) => item.icon)).toEqual(['pi pi-bullseye', 'pi pi-share-alt', 'pi pi-wave-pulse']);
  });

  it('choosing a step from a menu goes to its index in the trail', () => {
    navWidth = 250;
    const el = render(trailOf(...longSteps(8)));
    (el.querySelector('button[data-kind="before"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    fixture.componentInstance.menuItems()[1].command?.({});

    expect(goTo).toHaveBeenCalledWith(1);
  });

  it('renders no trailing chevron after the last item', () => {
    const items = render(trailOf(hypertension, ptbp1)).querySelectorAll(`${VISIBLE_ROW} > li`);

    expect(items[0].querySelector('.pi-angle-right')).toBeTruthy();
    expect(items[items.length - 1].querySelector('.pi-angle-right')).toBeFalsy();
  });

  it('clicking a step link goes to its index in the trail and prevents the default navigation', () => {
    const el = render({ steps: [hypertension, ptbp1, labile], current: 2 });
    const link = el.querySelectorAll(`${VISIBLE_ROW} a`)[1];
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(event);

    expect(goTo).toHaveBeenCalledWith(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it('leaves a modified click to the browser', () => {
    const el = render(trailOf(hypertension, ptbp1));
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true });
    el.querySelector(`${VISIBLE_ROW} a`)?.dispatchEvent(event);

    expect(goTo).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

  it('shows a "Clear history" button on the label line once there is more than one step', () => {
    const el = render(trailOf(hypertension, ptbp1));
    const button = el.querySelector('nav > div > button') as HTMLButtonElement;

    expect(button.textContent?.trim()).toBe('Clear history');
    button.click();
    expect(clear).toHaveBeenCalledTimes(1);
  });

  it('shows no "Clear history" button for a single step', () => {
    expect(render(trailOf(hypertension)).textContent).not.toContain('Clear history');
  });

  it('renders nothing visible but the label for an empty trail', () => {
    const el = render({ steps: [], current: -1 });

    expect(el.querySelectorAll(`${VISIBLE_ROW} > li`).length).toBe(0);
    expect(el.querySelector('nav > div > p')?.textContent?.trim()).toBe('Session History');
    expect(el.textContent).not.toContain('Clear history');
  });
});
