import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WritableSignal, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { EntityType } from '../../models/models';
import { SessionHistoryService } from '../../services/session-history/session-history.service';
import { SessionStep } from '../../services/session-history/session-history.types';
import { SessionHistoryComponent } from './session-history.component';

const hypertension: SessionStep = { entityType: EntityType.PHENOTYPE, id: 'HP:0000822', label: 'Hypertension' };
const ptbp1: SessionStep = { entityType: EntityType.GENE, id: 'NCBIGene:5725', label: 'PTBP1' };
const labile: SessionStep = { entityType: EntityType.PHENOTYPE, id: 'HP:0031992', label: 'Labile Hypertension' };
const diabetes: SessionStep = { entityType: EntityType.DISEASE, id: 'MONDO:0005015', label: 'Diabetes' };

describe('SessionHistoryComponent', () => {
  let fixture: ComponentFixture<SessionHistoryComponent>;
  let steps: WritableSignal<SessionStep[]>;
  let rewindTo: jest.Mock;

  /** Renders the component with the given trail. */
  function render(trail: SessionStep[]): HTMLElement {
    steps.set(trail);
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  beforeEach(async () => {
    steps = signal<SessionStep[]>([]);
    rewindTo = jest.fn();
    await TestBed.configureTestingModule({
      imports: [SessionHistoryComponent],
      providers: [provideRouter([]), { provide: SessionHistoryService, useValue: { steps, rewindTo } }],
    }).compileComponents();
    fixture = TestBed.createComponent(SessionHistoryComponent);
  });

  it('renders a nav landmark labelled "Session History"', () => {
    const nav = render([hypertension]).querySelector('nav');

    expect(nav?.getAttribute('aria-label')).toBe('Session History');
    expect(nav?.textContent).toContain('Session History');
  });

  it('renders every step as a link except the last', () => {
    const el = render([hypertension, ptbp1, labile]);
    const links = Array.from(el.querySelectorAll('a'));

    expect(links.map((a) => a.textContent?.trim())).toEqual(['Hypertension', 'PTBP1']);
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/term/HP:0000822', '/gene/NCBIGene:5725']);
  });

  it('renders the last step as plain text with aria-current page', () => {
    const el = render([hypertension, ptbp1]);
    const current = el.querySelector('[aria-current="page"]');

    expect(current?.textContent?.trim()).toBe('PTBP1');
    expect(current?.tagName).not.toBe('A');
  });

  it('shows a type icon on each step', () => {
    const el = render([hypertension, ptbp1, diabetes]);
    const icons = Array.from(el.querySelectorAll('li > a > i, li > [aria-current] > i')).map((i) => i.className);

    expect(icons.length).toBe(3);
    expect(new Set(icons).size).toBe(3);
  });

  it('shows the ellipsis and only the six most recent steps for a longer trail', () => {
    const long = Array.from({ length: 8 }, (_, i) => ({ ...labile, id: `HP:${i}`, label: `Step ${i}` }));
    const el = render(long);
    const labels = Array.from(el.querySelectorAll('li')).map((li) => li.textContent?.trim());

    expect(labels[0]).toBe('...');
    expect(labels.slice(1)).toEqual(['Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6', 'Step 7']);
  });

  it('shows no ellipsis for six or fewer steps', () => {
    expect(render([hypertension, ptbp1]).textContent).not.toContain('...');
  });

  it('renders no trailing chevron', () => {
    const el = render([hypertension, ptbp1]);
    const items = el.querySelectorAll('li');

    expect(items[0].querySelector('.pi-angle-right')).toBeTruthy();
    expect(items[items.length - 1].querySelector('.pi-angle-right')).toBeFalsy();
  });

  it('clicking an earlier step calls rewindTo with its full-trail index and prevents the default navigation', () => {
    const el = render([hypertension, ptbp1, labile]);
    const link = el.querySelectorAll('a')[1];
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(event);

    expect(rewindTo).toHaveBeenCalledWith(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it('leaves a modified click to the browser', () => {
    const el = render([hypertension, ptbp1]);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true });
    el.querySelector('a')?.dispatchEvent(event);

    expect(rewindTo).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

  it('renders nothing visible but the label for an empty trail', () => {
    const el = render([]);

    expect(el.querySelectorAll('li').length).toBe(0);
    expect(el.textContent?.trim()).toBe('Session History');
  });
});
