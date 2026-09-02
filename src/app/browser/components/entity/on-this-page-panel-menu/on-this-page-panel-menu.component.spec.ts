import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelMenuItem } from '../../../models/models';
import { OnThisPagePanelMenuComponent } from './on-this-page-panel-menu.component';

describe('OnThisPagePanelMenuComponent', () => {
  let fixture: ComponentFixture<OnThisPagePanelMenuComponent>;
  let component: OnThisPagePanelMenuComponent;

  const items: PanelMenuItem[] = [
    { id: 'summary', label: 'Summary', anchor: 'summary' },
    { id: 'disease-associations', label: 'Disease Associations', anchor: 'disease-associations', count: 3 },
    { id: 'loinc-associations', label: 'LOINC Associations', anchor: 'loinc-associations', count: 0, disabled: true },
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

  it('disables the button for a disabled item and does not scroll on click', () => {
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    expect(buttons[2].disabled).toBe(true);

    component.scrollTo(items[2]);
    expect(component.activeAnchor).toBeNull();
  });

  it('sets activeAnchor and scrolls the target element into view when an enabled item is clicked', () => {
    const el = document.createElement('div');
    el.id = 'disease-associations';
    const scrollSpy = jest.fn();
    el.scrollIntoView = scrollSpy;
    document.body.appendChild(el);

    component.scrollTo(items[1]);

    expect(component.activeAnchor).toBe('disease-associations');
    expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });

    document.body.removeChild(el);
  });

  describe('scroll position tracking', () => {
    // jsdom gives every element a zero rect, so positions are stubbed. Real
    // scrolling is covered by cypress/e2e/browse-term.cy.ts.
    const VIEWPORT = 1000;   // activation line lands at 300
    const placed: HTMLElement[] = [];

    const place = (id: string, top: number) => {
      const el = document.createElement('div');
      el.id = id;
      el.getBoundingClientRect = () => ({ top, height: 200, bottom: top + 200 }) as DOMRect;
      document.body.appendChild(el);
      placed.push(el);
    };

    beforeEach(() => {
      Object.defineProperty(window, 'innerHeight', { value: VIEWPORT, configurable: true });
    });

    afterEach(() => {
      placed.splice(0).forEach((el) => el.remove());
    });

    it('marks the lowest section whose top has passed the activation line', () => {
      place('summary', -400);
      place('disease-associations', 100);
      component['refresh']();
      expect(component.activeAnchor).toBe('disease-associations');
    });

    it('holds the section above until the next one reaches the line', () => {
      place('summary', -400);
      place('disease-associations', 500); // below the line at 300
      component['refresh']();
      expect(component.activeAnchor).toBe('summary');
    });

    it('never activates a disabled (empty) section', () => {
      place('summary', -800);
      place('disease-associations', -400);
      place('loinc-associations', 100); // would win on position, but is disabled
      component['refresh']();
      expect(component.activeAnchor).toBe('disease-associations');
    });

    it('falls back to the first section when none has reached the line yet', () => {
      place('summary', 600);
      place('disease-associations', 900);
      component['refresh']();
      expect(component.activeAnchor).toBe('summary');
    });

    it('resolves by position, not by the order of items', () => {
      // items are [summary, disease, loinc] but disease sits above summary here
      place('summary', 100);
      place('disease-associations', -400);
      component['refresh']();
      expect(component.activeAnchor).toBe('summary');
    });

    it('ignores anchors with no element in the DOM', () => {
      place('summary', -400);
      expect(() => component['refresh']()).not.toThrow();
      expect(component.activeAnchor).toBe('summary');
    });
  });

  it('gives the active item a solid teal pill and disabled items muted styling', () => {
    component.activeAnchor = 'disease-associations';
    expect(component.itemClasses(items[1])).toContain('bg-[var(--p-teal-300)]');
    expect(component.itemClasses(items[2])).toContain('cursor-not-allowed');
  });

});
