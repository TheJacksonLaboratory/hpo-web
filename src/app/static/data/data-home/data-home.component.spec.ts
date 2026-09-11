import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { DataHomeComponent } from './data-home.component';

describe('DataHomeComponent', () => {
  let component: DataHomeComponent;
  let fixture: ComponentFixture<DataHomeComponent>;
  let navigateSpy: jest.SpyInstance;

  function configure(queryParams: Record<string, string> = {}): void {
    TestBed.configureTestingModule({
      imports: [DataHomeComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { queryParams: of(queryParams) } },
      ],
    });

    // jest.spyOn keeps the original implementation unless one is supplied, which would
    // fire a real navigation against the empty route config above.
    navigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(DataHomeComponent);
    component = fixture.componentInstance;
  }

  it('should create', () => {
    configure();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('defaults to the ontology tab', () => {
    configure();
    fixture.detectChanges();
    expect(component.activeTab).toBe('ontology');
  });

  it('reads the initial tab from the "tab" query param', () => {
    configure({ tab: 'annotations' });
    fixture.detectChanges();
    expect(component.activeTab).toBe('annotations');
  });

  it('falls back to the ontology tab for an unrecognized "tab" value', () => {
    configure({ tab: 'not-a-real-tab' });
    fixture.detectChanges();
    expect(component.activeTab).toBe('ontology');
  });

  it('renders a row for every ontology file', () => {
    configure();
    fixture.detectChanges();
    expect(component.ontologyFiles.length).toBe(3);
    expect(component.ontologyFiles.map((f) => f.name)).toEqual(['hp.obo', 'hp.owl', 'hp.json']);
  });

  it('renders a row for every annotation file, including the primary phenotype.hpoa file', () => {
    configure();
    fixture.detectChanges();
    expect(component.annotationFiles.length).toBe(5);
    expect(component.annotationFiles[0].name).toBe('phenotype.hpoa');
  });

  it('updates activeTab and navigates when the tab changes', () => {
    configure();
    fixture.detectChanges();
    navigateSpy.mockClear();

    component.onTabChange('api');

    expect(component.activeTab).toBe('api');
    expect(navigateSpy).toHaveBeenCalledWith([], {
      relativeTo: expect.anything(),
      queryParams: { tab: 'api' },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  });

  it('rewrites the URL to the canonical tab when the param is missing or unrecognized', () => {
    configure({ tab: 'not-a-real-tab' });
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith([], {
      relativeTo: expect.anything(),
      queryParams: { tab: 'ontology' },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  });

  it('does not renavigate when the tab param is already canonical', () => {
    configure({ tab: 'annotations' });
    fixture.detectChanges();

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
