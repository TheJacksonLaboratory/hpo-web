import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdBadgeComponent } from './id-badge.component';

describe('IdBadgeComponent', () => {
  let fixture: ComponentFixture<IdBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [IdBadgeComponent] }).compileComponents();
    fixture = TestBed.createComponent(IdBadgeComponent);
    fixture.componentInstance.id = 'HP:0001250';
  });

  it('renders the id as plain text when there is no external url', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('HP:0001250');
    expect(fixture.nativeElement.querySelector('a')).toBeFalsy();
  });

  it('renders the id as an external link when an externalUrl is given', () => {
    fixture.componentInstance.externalUrl = 'https://monarchinitiative.org/disease/MONDO:0000001';
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a');
    expect(link.getAttribute('href')).toBe('https://monarchinitiative.org/disease/MONDO:0000001');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('renders no button when not copyable', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('.pi-copy')).toBeFalsy();
  });

  it('makes the whole chip one button when copyable, with the id inside it', () => {
    fixture.componentInstance.copyable = true;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
    expect(button.getAttribute('type')).toBe('button');
    // the id and the icon are both inside the button, so the entire chip copies
    expect(button.textContent).toContain('HP:0001250');
    expect(button.querySelector('.pi-copy')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('button').length).toBe(1);
  });

  it('labels the copy button with the id for screen readers', () => {
    fixture.componentInstance.copyable = true;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Copy HP:0001250');
    expect(button.querySelector('.pi-copy').getAttribute('aria-hidden')).toBe('true');
  });

  describe('copied confirmation', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      fixture.componentInstance.copyable = true;
      fixture.detectChanges();
    });

    afterEach(() => jest.useRealTimers());

    const icon = () => fixture.nativeElement.querySelector('button i');
    const status = () => fixture.nativeElement.querySelector('[role="status"]');

    it('shows the copy icon and an empty status before any copy', () => {
      expect(icon().classList).toContain('pi-copy');
      expect(icon().classList).not.toContain('pi-check');
      expect(status().textContent.trim()).toBe('');
    });

    it('swaps to a tick and announces the copy on success', () => {
      fixture.componentInstance.onCopied(true);
      fixture.detectChanges();

      expect(icon().classList).toContain('pi-check');
      expect(icon().classList).not.toContain('pi-copy');
      expect(status().textContent.trim()).toBe('Copied HP:0001250');
    });

    it('reverts to the copy icon after the confirmation window', () => {
      fixture.componentInstance.onCopied(true);
      fixture.detectChanges();
      expect(icon().classList).toContain('pi-check');

      jest.advanceTimersByTime(1500);
      fixture.detectChanges();
      expect(icon().classList).toContain('pi-copy');
      expect(status().textContent.trim()).toBe('');
    });

    it('does not confirm when the clipboard write failed', () => {
      fixture.componentInstance.onCopied(false);
      fixture.detectChanges();
      expect(icon().classList).toContain('pi-copy');
      expect(status().textContent.trim()).toBe('');
    });

    it('restarts the window on a second copy rather than cutting it short', () => {
      fixture.componentInstance.onCopied(true);
      jest.advanceTimersByTime(1000);
      fixture.componentInstance.onCopied(true);
      jest.advanceTimersByTime(1000);
      fixture.detectChanges();

      // the first timer would have fired by now; the second must still hold
      expect(icon().classList).toContain('pi-check');

      jest.advanceTimersByTime(500);
      fixture.detectChanges();
      expect(icon().classList).toContain('pi-copy');
    });

    it('clears its timer on destroy', () => {
      fixture.componentInstance.onCopied(true);
      fixture.destroy();
      expect(() => jest.advanceTimersByTime(1500)).not.toThrow();
    });
  });

  it('prefers the copy button over a link when both are configured', () => {
    fixture.componentInstance.copyable = true;
    fixture.componentInstance.externalUrl = 'https://example.com/HP:0001250';
    fixture.detectChanges();

    // nesting an <a> inside a <button> would be invalid, so copyable wins
    expect(fixture.nativeElement.querySelector('button')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('a')).toBeFalsy();
  });
});
