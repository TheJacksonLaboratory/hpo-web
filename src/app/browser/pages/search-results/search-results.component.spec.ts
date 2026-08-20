import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';

import { SearchResultsComponent } from './search-results.component';
import { SearchService } from '../../../shared/search/service/search.service';

// Deliberately NOT in any sorted order, so "Most Relevant" (= API order) is
// distinguishable from every other option.
const TERMS = [
  { id: 'HP:0000010', name: 'Bravo phenotype', definition: 'b', synonyms: [] },
  { id: 'HP:0000002', name: 'zulu phenotype', definition: 'z', synonyms: [] },
  { id: 'HP:0000100', name: 'Alpha phenotype', definition: 'a', synonyms: [] },
];

// Gene identifiers are not zero-padded, so they are what actually exercises
// numeric collation - lexicographically "NCBIGene:10" sorts before "NCBIGene:2".
const GENES = [
  { id: 'NCBIGene:10', name: 'NAT2' },
  { id: 'NCBIGene:100', name: 'ADA' },
  { id: 'NCBIGene:2', name: 'A2M' },
];

const DISEASES = [
  { id: 'OMIM:154700', name: 'Marfan syndrome' },
  { id: 'OMIM:100100', name: 'Prune belly syndrome' },
];

class SearchServiceStub {
  searchAll(): Observable<unknown> {
    return of({
      terms: { terms: TERMS.map((t) => ({ ...t })) },
      genes: { results: GENES.map((g) => ({ ...g })), totalCount: GENES.length },
      diseases: { results: DISEASES.map((d) => ({ ...d })), totalCount: DISEASES.length },
    });
  }
}

describe('SearchResultsComponent sorting', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;

  const selectSort = (value: string): void => {
    const option = component.sortOptions.find((o) => o.value === value);
    expect(option).toBeDefined();
    component.sortBy = option;
    component.onSortChange();
  };

  const titles = (): string[] => component.sortedItems.map((i) => i.title);
  const ids = (): string[] => component.sortedItems.map((i) => i.subtitle);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SearchResultsComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: SearchService, useClass: SearchServiceStub },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({ q: 'phenotype', navFilter: 'term' }) },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load results', () => {
    expect(component).toBeTruthy();
    expect(component.termItems.length).toBe(3);
    expect(component.geneItems.length).toBe(3);
    expect(component.diseaseItems.length).toBe(2);
  });

  it('defaults to Most Relevant, which is the order the API returned', () => {
    expect(component.sortBy.value).toBe('relevant');
    expect(ids()).toEqual(['HP:0000010', 'HP:0000002', 'HP:0000100']);
  });

  it('sorts by name A-Z, case-insensitively', () => {
    selectSort('name-asc');
    expect(titles()).toEqual(['Alpha phenotype', 'Bravo phenotype', 'zulu phenotype']);
  });

  it('sorts by name Z-A', () => {
    selectSort('name-desc');
    expect(titles()).toEqual(['zulu phenotype', 'Bravo phenotype', 'Alpha phenotype']);
  });

  it('sorts by identifier A-Z', () => {
    selectSort('identifier-asc');
    expect(ids()).toEqual(['HP:0000002', 'HP:0000010', 'HP:0000100']);
  });

  it('sorts by identifier Z-A', () => {
    selectSort('identifier-desc');
    expect(ids()).toEqual(['HP:0000100', 'HP:0000010', 'HP:0000002']);
  });

  it('compares identifiers numerically, not lexicographically', () => {
    component.onTabChange('gene');
    selectSort('identifier-asc');
    // Lexicographic order would be NCBIGene:10, NCBIGene:100, NCBIGene:2.
    expect(ids()).toEqual(['NCBIGene:2', 'NCBIGene:10', 'NCBIGene:100']);
  });

  it('restores the original API order when switching back to Most Relevant', () => {
    const relevanceOrder = ids();

    selectSort('name-asc');
    expect(ids()).not.toEqual(relevanceOrder);

    selectSort('relevant');
    expect(ids()).toEqual(relevanceOrder);
  });

  it('does not mutate the underlying category array when sorting', () => {
    selectSort('name-asc');
    expect(component.termItems.map((i) => i.subtitle)).toEqual([
      'HP:0000010',
      'HP:0000002',
      'HP:0000100',
    ]);
  });

  it('re-applies the current sort after switching tabs', () => {
    selectSort('name-asc');
    component.onTabChange('disease');

    expect(titles()).toEqual(['Marfan syndrome', 'Prune belly syndrome']);
  });

  it('resets to the first page when the sort changes', () => {
    component.first = 10;
    selectSort('name-asc');

    expect(component.first).toBe(0);
  });

  it('pages from the sorted list, not the API order', () => {
    component.rows = 1;
    selectSort('name-asc');

    expect(component.pagedItems.map((i) => i.title)).toEqual(['Alpha phenotype']);
  });
});
