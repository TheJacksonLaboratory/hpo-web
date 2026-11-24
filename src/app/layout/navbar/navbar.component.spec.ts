import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  beforeAll(() => {
    // jsdom has no matchMedia; PrimeNG's menubar uses it for its breakpoint.
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }),
    });
  });

  function render(): HTMLElement {
    TestBed.configureTestingModule({
      imports: [NavbarComponent, NoopAnimationsModule],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  it('renders the main links', () => {
    const labels = Array.from(render().querySelectorAll('.p-menubar-item-link span')).map((el) =>
      el.textContent?.trim(),
    );
    expect(labels).toEqual(['Data', 'Tools', 'Documentation']);
  });

  it('opens Documentation in a new tab', () => {
    const link = Array.from(render().querySelectorAll<HTMLAnchorElement>('a.p-menubar-item-link')).find((a) =>
      a.textContent?.includes('Documentation'),
    );
    expect(link?.getAttribute('href')).toBe('https://obophenotype.github.io/human-phenotype-ontology/');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener');
  });

  it('shows the Clinical Clipboard button', () => {
    expect(render().querySelector('.p-menubar-end app-clinical-clipboard button')).toBeTruthy();
  });
});
