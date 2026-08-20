import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { JdsAutocompleteComponent, JdsAutocompleteGroup, JdsAutocompleteItem } from '@jax-data-science/components';
import { SimpleTerm, Term } from '../../../browser/models/models';
import { SearchService } from '../service/search.service';

const SUGGESTIONS_PER_CATEGORY = 5;

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [Button, JdsAutocompleteComponent],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
})
export class SearchFormComponent implements OnInit, OnChanges {
  /** Initial/current query text, e.g. when embedded as a page's editable search box. */
  @Input() query = '';
  @Input() showPopularSearches = true;
  @Input() showAdditionalCriteria = false;
  @Input() placeholder = 'Search for phenotypes, diseases or genes, including synonyms';

  /** Emitted on submit; consumers embedding this as a page header handle their own routing. */
  @Output() search = new EventEmitter<string>();

  searchQuery = '';
  suggestions: JdsAutocompleteGroup[] = [];
  readonly popularSearches = ['Long Fingers', 'FBN1', 'Marfan Syndrome'];

  // Visual-only stub: no additional-criteria form exists in the design yet.
  additionalCriteriaExpanded = false;

  // Suggestions only carry {id, label}; this recovers the entity page each id routes
  // to (rebuilt on every completeMethod response) for onSelectItem to navigate with.
  private routerLinkById = new Map<string, string>();

  // switchMap so a fast-typed keystroke cancels the previous request instead of
  // racing it - otherwise a slower stale response can land after a newer one and
  // overwrite it with outdated suggestions.
  private queryChanged = new Subject<string>();

  private router = inject(Router);
  private searchService = inject(SearchService);

  ngOnInit(): void {
    this.searchQuery = this.query;

    this.queryChanged.pipe(
      switchMap((query) => this.searchService.searchAll(query, SUGGESTIONS_PER_CATEGORY))
    ).subscribe(({ terms, genes, diseases }) => {
      this.routerLinkById.clear();
      this.suggestions = [
        this.toGroup<Term>('Phenotypes', terms.terms, (term) => `/term/${term.id}`),
        this.toGroup<SimpleTerm>('Diseases', diseases.results, (disease) => `/diseases/${disease.id}`),
        this.toGroup<SimpleTerm>('Genes', genes.results, (gene) => `/gene/${gene.id}`),
      ].filter((group) => group.items.length > 0);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['query'] && !changes['query'].firstChange) {
      this.searchQuery = this.query;
    }
  }

  onComplete({ query }: { query: string }): void {
    this.searchQuery = query;
    this.queryChanged.next(query);
  }

  onSelectItem(item: JdsAutocompleteItem): void {
    const routerLink = this.routerLinkById.get(item.id);
    if (routerLink) {
      this.router.navigate([routerLink]);
    }
  }

  onCleared(): void {
    this.suggestions = [];
  }

  private toGroup<T extends SimpleTerm>(groupLabel: string, results: T[], routerLink: (result: T) => string): JdsAutocompleteGroup {
    const items: JdsAutocompleteItem[] = results.map((result) => {
      this.routerLinkById.set(result.id, routerLink(result));
      return { id: result.id, label: result.name };
    });
    return { groupLabel, items };
  }

  submitSearch(query: string): void {
    const trimmed = query.trim();
    if (!trimmed) return;
    this.search.emit(trimmed);
    if (!this.showAdditionalCriteria) {
      this.router.navigate(['/search'], {
        queryParams: { q: trimmed, navFilter: 'all' },
      });
    }
  }

  toggleAdditionalCriteria(): void {
    this.additionalCriteriaExpanded = !this.additionalCriteriaExpanded;
  }
}
