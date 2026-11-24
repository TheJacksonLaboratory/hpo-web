import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelMenuItem } from '../../../models/models';
import { OnThisPagePanelMenuComponent } from './on-this-page-panel-menu.component';

describe('OnThisPagePanelMenuComponent', () => {
  let fixture: ComponentFixture<OnThisPagePanelMenuComponent>;
  let component: OnThisPagePanelMenuComponent;

  const items: PanelMenuItem[] = [
    { id: 'summary', label: 'Summary', anchor: 'summary' },
    { id: 'disease-associations', label: 'Disease Associations', anchor: 'disease-associations', count: 3 },
    { id: 'loinc-associations', label: 'LOINC Associations', anchor: 'loinc-associations', count: 0 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OnThisPagePanelMenuComponent] }).compileComponents();
    fixture = TestBed.createComponent(OnThisPagePanelMenuComponent);
    component = fixture.componentInstance;
    component.items = items;
    fixture.detectChanges();
  });

  it('renders one button per item with its label and count', () => {
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    expect(buttons).toHaveLength(3);
    expect(buttons[1].textContent).toContain('Disease Associations');
    expect(buttons[1].textContent).toContain('3');
  });

  it('sets activeAnchor and scrolls the target element into view when an item is clicked', () => {
    const el = document.createElement('div');
    el.id = 'disease-associations';
    const scrollSpy = jest.fn();
    el.scrollIntoView = scrollSpy;
    document.body.appendChild(el);

    component.scrollTo(items[1]);

    expect(component.activeAnchor).toBe('disease-associations');
    expect(scrollSpy).toHaveBeenCalledWith({ block: 'start' });

    document.body.removeChild(el);
  });

  describe('scroll position tracking', () => {
    // jsdom gives every element a zero rect, so positions are stubbed. Real
    // scrolling is covered by cypress/e2e/browse-term.cy.ts.
    const VIEWPORT = 1000;   // handover happens one section gap (32px) from the top
    const placed: HTMLElement[] = [];

    const place = (id: string, top: number, height = 200) => {
      const el = document.createElement('div');
      el.id = id;
      el.getBoundingClientRect = () => ({ top, height, bottom: top + height }) as DOMRect;
      document.body.appendChild(el);
      placed.push(el);
    };

    beforeEach(() => {
      Object.defineProperty(window, 'innerHeight', { value: VIEWPORT, configurable: true });
      Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    });

    afterEach(() => {
      placed.splice(0).forEach((el) => el.remove());
    });

    it('marks the section the reader is inside', () => {
      place('summary', -400);
      place('disease-associations', 100);
      component['refresh']();
      expect(component.activeAnchor).toBe('disease-associations');
    });

    it('moves to the upcoming section once the one above has scrolled off', () => {
      place('summary', -400); // ends at -200, entirely above the viewport
      place('disease-associations', 500); // not reached yet, but the next one up
      component['refresh']();
      expect(component.activeAnchor).toBe('disease-associations');
    });

    it('falls back to the first section when none has reached the line yet', () => {
      place('summary', 600);
      place('disease-associations', 900);
      component['refresh']();
      expect(component.activeAnchor).toBe('summary');
    });

    it('resolves in item order, which is the page order the template fixes', () => {
      // items are [summary, disease, loinc] and the first whose bottom is past
      // the offset wins, so summary does even though disease sits above it here
      place('summary', 100);
      place('disease-associations', -400);
      component['refresh']();
      expect(component.activeAnchor).toBe('summary');
    });

    it('activates a short section, which a line further down the viewport could not', () => {
      // The shape that broke: a short section sitting near the top of the
      // viewport, with a taller one below it. A rule keyed off a line lower
      // down the viewport sat below the short section entirely, so the section
      // after it always won and the short one could never be reached.
      place('summary', -200, 200);
      place('disease-associations', 0, 100);
      place('loinc-associations', 132, 300);
      component['refresh']();
      expect(component.activeAnchor).toBe('disease-associations');
    });

    it('holds a clicked section the page cannot scroll to the top, until the reader scrolls', () => {
      // Shaped after the real case: clicking the last section clamps at the
      // page end, where the section above it still covers the handover point.
      // Position would name that one; the click has to win until the reader
      // moves.
      place('disease-associations', -200, 250);
      place('loinc-associations', 82, 136);
      document.getElementById('loinc-associations')!.scrollIntoView = jest.fn();
      Object.defineProperty(window, 'scrollY', { value: 1000, configurable: true });

      component.scrollTo(items[2]);
      component['refresh']();
      expect(component.activeAnchor).toBe('loinc-associations');

      Object.defineProperty(window, 'scrollY', { value: 800, configurable: true });
      component['refresh']();
      expect(component.activeAnchor).toBe('disease-associations');
    });

    it('ignores anchors with no element in the DOM', () => {
      place('summary', -400);
      expect(() => component['refresh']()).not.toThrow();
      expect(component.activeAnchor).toBe('summary');
    });
  });

  it('gives the active item a solid teal pill, empty sections included', () => {
    component.activeAnchor = 'loinc-associations';
    fixture.detectChanges();

    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    expect(buttons[2].className).toContain('bg-[var(--p-teal-300)]');
    expect(buttons[0].className).toContain('text-[var(--p-text-color)]');
    expect(buttons[0].className).not.toContain('bg-[var(--p-teal-300)]');
  });

});
