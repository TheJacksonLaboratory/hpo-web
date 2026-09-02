import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [EmptyStateComponent] }).compileComponents();
    fixture = TestBed.createComponent(EmptyStateComponent);
  });

  it('renders no "nothing found" copy - the section heading reports the count', () => {
    fixture.componentInstance.ctaHref = 'https://example.com/contribute';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('No ');
    expect(fixture.nativeElement.textContent).not.toContain('found');
  });

  it('omits the CTA link when no ctaHref is given', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a')).toBeFalsy();
  });

  it('renders the contribute CTA with its default label once a ctaHref is given', () => {
    fixture.componentInstance.ctaHref = 'https://example.com/contribute';
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a');
    expect(link.textContent).toContain('Interested in Contributing? Get Started');
    expect(link.getAttribute('href')).toBe('https://example.com/contribute');
  });

  it('allows the label to be overridden', () => {
    fixture.componentInstance.ctaHref = 'https://example.com/contribute';
    fixture.componentInstance.ctaLabel = 'Add a LOINC mapping';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a').textContent).toContain('Add a LOINC mapping');
  });
});
