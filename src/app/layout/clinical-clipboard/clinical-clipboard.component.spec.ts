import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClinicalClipboardComponent } from './clinical-clipboard.component';
import { ClinicalClipboardService } from '../../browser/services/clinical-clipboard/clinical-clipboard.service';

describe('ClinicalClipboardComponent', () => {
  const hypertension = { id: 'HP:0000822', name: 'Hypertension' };
  const labile = { id: 'HP:6000321', name: 'Labile hypertension' };

  let fixture: ComponentFixture<ClinicalClipboardComponent>;
  let el: HTMLElement;
  let service: ClinicalClipboardService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [ClinicalClipboardComponent, NoopAnimationsModule] });
    service = TestBed.inject(ClinicalClipboardService);
    fixture = TestBed.createComponent(ClinicalClipboardComponent);
    el = fixture.nativeElement;
    document.body.appendChild(el);
    fixture.detectChanges();
  });

  afterEach(() => (document.body.innerHTML = ''));

  const button = () => el.querySelector<HTMLButtonElement>('button')!;
  const badge = () => button().querySelector('span');
  const panel = () => document.querySelector<HTMLElement>('[data-clinical-clipboard-panel]');
  const title = () => panel()!.querySelector<HTMLElement>('#clinical-clipboard-title')!;

  /** Clicks the toggle button and waits for the popover to render. */
  async function open(): Promise<void> {
    button().click();
    await settle();
  }

  /** Runs change detection until the popover's animations have finished. */
  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  /** Seeds the list and renders it. */
  function seed(...terms: { id: string; name: string }[]): void {
    terms.forEach((term) => service.add(term));
    fixture.detectChanges();
  }

  it('shows no badge when empty, and the empty state when opened', async () => {
    expect(panel()).toBeNull();
    expect(badge()).toBeNull();
    expect(button().getAttribute('aria-label')).toBe('Clinical clipboard, 0 items');

    await open();
    expect(panel()!.closest('[role="dialog"]')).not.toBeNull();
    expect(button().getAttribute('aria-expanded')).toBe('true');
    expect(panel()!.textContent).toContain('Your clipboard is empty');
    expect(panel()!.querySelector('[data-clinical-clipboard-clear]')).toBeNull();
  });

  it('shows the count and lists terms newest first', async () => {
    seed(hypertension, labile);
    expect(badge()?.textContent?.trim()).toBe('2');
    expect(button().getAttribute('aria-label')).toBe('Clinical clipboard, 2 items');

    await open();
    const names = Array.from(panel()!.querySelectorAll('li .font-semibold')).map((n) => n.textContent);
    expect(names).toEqual(['Labile hypertension', 'Hypertension']);
    expect(title().textContent).toContain('(2)');
  });

  it('caps the badge at 99+', () => {
    seed(...Array.from({ length: 100 }, (_, i) => ({ id: `HP:${i}`, name: `T${i}` })));
    expect(badge()?.textContent?.trim()).toBe('99+');
  });

  it('moves focus into the panel when it opens', async () => {
    await open();
    expect(document.activeElement).toBe(title());
  });

  it('removes a row, keeps the panel open, and clears all', async () => {
    seed(hypertension, labile);
    await open();

    panel()!.querySelector<HTMLButtonElement>('[data-clinical-clipboard-remove]')!.click();
    await settle();
    expect(service.terms()).toEqual([hypertension]);
    expect(panel()).not.toBeNull();

    panel()!.querySelector<HTMLButtonElement>('[data-clinical-clipboard-clear]')!.click();
    fixture.detectChanges();
    expect(service.count()).toBe(0);
    expect(document.activeElement).toBe(button());
  });

  it('closes on Escape and returns focus to the button', async () => {
    await open();
    title().focus();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await settle();

    expect(panel()).toBeNull();
    expect(button().getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button());
  });

  it('closes on an outside click without taking focus', async () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    await open();

    outside.focus();
    outside.click();
    await settle();

    expect(panel()).toBeNull();
    expect(button().getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(outside);
  });

  it('exports the list as clinical-clipboard.csv', () => {
    seed(hypertension);
    const createObjectURL = jest.fn(() => 'blob:x');
    Object.assign(URL, { createObjectURL, revokeObjectURL: jest.fn() });
    let downloaded = '';
    const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      downloaded = this.download;
    });

    fixture.componentInstance.exportCsv();
    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(downloaded).toBe('clinical-clipboard.csv');
    click.mockRestore();
  });
});
