import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Tabs, TabList, Tab } from 'primeng/tabs';
import { ToggleButton } from 'primeng/togglebutton';
import { Select } from 'primeng/select';
import { Paginator, PaginatorState } from 'primeng/paginator';

import { SimpleTerm, Term } from '../../models/models';
import { SearchService } from '../../../shared/search/service/search.service';
import { SearchResultCardComponent, SearchResultItem } from './search-result-card/search-result-card.component';
import { SearchFormComponent } from '../../../shared/search/search-form/search-form.component';

type ResultCategory = 'all' | 'term' | 'disease' | 'gene';

interface SortOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [FormsModule, Tabs, TabList, Tab, ToggleButton, Select, Paginator, SearchResultCardComponent, SearchFormComponent],
  templateUrl: './search-results.component.html',
})
export class SearchResultsComponent {

  query: string;
  isLoading = true;
  activeCategory: ResultCategory = 'all';

  termItems: SearchResultItem[] = [];
  diseaseItems: SearchResultItem[] = [];
  geneItems: SearchResultItem[] = [];
  allItems: SearchResultItem[] = [];

  // Visual-only stub: not wired to any real subcategory filtering data/API yet.
  subcategoryPills = ['Placeholder Subcategory', 'Placeholder Subcategory', 'Placeholder Subcategory'];
  subcategoryPillActive: boolean[] = this.subcategoryPills.map(() => false);

  // Visual-only stub: options match the Figma menu, but no sort logic is wired yet.
  sortOptions: SortOption[] = [
    { label: 'Most Relevant', value: 'relevant' },
    { label: 'Identifier (A-Z)', value: 'identifier-asc' },
    { label: 'Identifier (Z-A)', value: 'identifier-desc' },
    { label: 'Name (A-Z)', value: 'name-asc' },
    { label: 'Name (Z-A)', value: 'name-desc' },
  ];
  sortBy: SortOption = this.sortOptions[0];

  first = 0;
  rows = 20;
  rowsPerPageOptions = [20, 50, 100, 500];

  constructor(private route: ActivatedRoute, private router: Router, private searchService: SearchService) {
    this.route.queryParams.subscribe((params) => {
      this.query = params['q'];
      this.activeCategory = (params['navFilter'] as ResultCategory) ?? 'all';
      this.reloadResultsData();
    });
  }

  onSearchSubmit(newQuery: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: newQuery, navFilter: this.activeCategory },
    });
  }

  get activeCategoryItems(): SearchResultItem[] {
    switch (this.activeCategory) {
      case 'term':
        return this.termItems;
      case 'disease':
        return this.diseaseItems;
      case 'gene':
        return this.geneItems;
      default:
        return this.allItems;
    }
  }

  get pagedItems(): SearchResultItem[] {
    return this.activeCategoryItems.slice(this.first, this.first + this.rows);
  }

  onTabChange(category: string | number | undefined): void {
    this.activeCategory = (category as ResultCategory) ?? 'all';
    this.first = 0;
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? this.rows;
  }

  reloadResultsData(): void {
    this.isLoading = true;

    this.searchService.searchAll(this.query, -1).subscribe(({ terms, genes, diseases }) => {
      this.termItems = this.termMatchingStringBuilder(this.query, terms.terms).map((term) => ({
        category: 'term' as const,
        id: term.id,
        routerLink: `/browse/term/${term.id}`,
        title: term.name,
        subtitle: term.id,
        matchingString: term['matchingString'] ?? term.name,
        description: term.definition ?? '',
      }));

      this.diseaseItems = this.responseMatchingStringBuilder<SimpleTerm>(diseases.results).map((disease) => ({
        category: 'disease' as const,
        id: disease.id,
        routerLink: `/browse/disease/${disease.id}`,
        title: disease.name,
        subtitle: disease.id,
        matchingString: disease['matchingString'] ?? disease.name,
        description: '',
      }));

      this.geneItems = this.responseMatchingStringBuilder<SimpleTerm>(genes.results).map((gene) => ({
        category: 'gene' as const,
        id: gene.id,
        routerLink: `/browse/gene/${gene.id}`,
        title: gene.name,
        subtitle: gene.id,
        matchingString: gene['matchingString'] ?? gene.name,
        description: '',
      }));

      this.allItems = [...this.termItems, ...this.diseaseItems, ...this.geneItems];
      this.first = 0;
      this.isLoading = false;
    }, (error) => {
      console.log(error);
      this.isLoading = false;
    });
  }

  // Ported unchanged from search-results.component.ts to preserve existing
  // synonym-aware highlight-matching behavior.
  termMatchingStringBuilder(query: string, termResponse: Term[]): Term[] {
    termResponse.map(term => {
      term.synonyms?.map(syn => {
        if (syn.toLowerCase().includes(query.toLowerCase())) {
          term['matchingString'] = syn;
          return;
        }
      });
      if (!term['matchingString']) {
        term['matchingString'] = term.name;
      }
    });
    return termResponse;
  }

  responseMatchingStringBuilder<T extends { name: string; matchingString?: string }>(response: T[]): T[] {
    response.map(result => {
      if (result.name) {
        result.matchingString = result.name;
      }
    });
    return response;
  }
}
