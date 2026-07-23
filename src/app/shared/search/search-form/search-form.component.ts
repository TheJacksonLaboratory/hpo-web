import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [FormsModule, InputText, Button],
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
  readonly popularSearches = ['Long Fingers', 'FBN1', 'Marfan Syndrome'];

  // Visual-only stub: no additional-criteria form exists in the design yet.
  additionalCriteriaExpanded = false;

  private router = inject(Router);

  ngOnInit(): void {
    this.searchQuery = this.query;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['query'] && !changes['query'].firstChange) {
      this.searchQuery = this.query;
    }
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
