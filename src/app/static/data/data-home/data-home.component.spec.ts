import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { DataHomeComponent } from './data-home.component';

describe('DataHomeComponent', () => {
  let component: DataHomeComponent;
  let fixture: ComponentFixture<DataHomeComponent>;

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
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.onTabChange('api');

    expect(component.activeTab).toBe('api');
    expect(navigateSpy).toHaveBeenCalledWith([], { relativeTo: expect.anything(), queryParams: { tab: 'api' } });
  });
});
