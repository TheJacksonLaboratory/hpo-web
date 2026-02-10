import { Router, RouterModule } from '@angular/router';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimpleTerm, Term } from '../../../browser/models/models';
import { SearchService } from '../service/search.service';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HighlightPipe } from '../../pipes/highlight.pipe';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatSelectModule,
    MatInputModule,
    MatProgressBarModule,
    HighlightPipe
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [
    trigger('searchState', [
      state('inactive', style({
        'height': 0,
        'overflow-y': 'hidden',
        'visibility': 'hidden'
      })),
      state('active', style({
        'max-height': '750px',
        'overflow-y': 'scroll',
        'visibility': 'visible'
      })),
      transition('inactive => active',
        animate('500ms ease-in-out')),
      transition('active => inactive',
        animate('200ms ease-in-out'))
    ])
  ]
})
export class SearchComponent implements OnInit {

  @Input() showHint = false;
  terms: Term[] = [];
  diseases: SimpleTerm[] = [];
  genes: SimpleTerm[] = [];
  termsCount: number;
  diseasesCount: number;
  genesCount: number;
  searchstate = 'inactive';
  query = new Subject();
  queryString = '';
  navFilter = 'all';
  queryText: string;
  notFoundFlag = false;
  loadingSearchResults = false;

  @ViewChild('searchbar', { static: true }) searchBar: ElementRef;

  constructor(private router: Router, private searchService: SearchService) {
    this.router = router;
  }

  ngOnInit() {
    this.query.pipe(debounceTime(1000),
      distinctUntilChanged()).subscribe((val: string) => {
      if (this.hasValidInput(val)) {
        this.loadingSearchResults = true;
        this.queryText = val


        this.searchService.searchAll(val, 10).subscribe(({ terms, genes, diseases }) => {
          this.terms = terms.terms;
          this.diseases = diseases.results;
          this.genes = genes.results;
          this.termsCount = terms.terms.length;
          this.diseasesCount = diseases.totalCount;
          this.genesCount = genes.totalCount;
          this.notFoundFlag = (this.terms.length === 0 && this.diseases.length === 0 && this.genes.length === 0);
          this.searchstate = 'active';
        }, (error) => {
          console.log(error);
          this.loadingSearchResults = false;
        }, () => {
          this.loadingSearchResults = false;
        });
      } else {
        this.searchstate = 'inactive';
      }
    }); // End debounce subscribe
  }

  contentChanging(input: string) {
    this.query.next(input);
  }

  setQuery(term: string): void {
    this.queryString = term;
    this.contentChanging(term);
    this.searchBar.nativeElement.focus();
  }

  hasValidInput(qString: string) {
    return (qString && qString.length >= 3);
  }

  toggleDropdown(target: FocusEvent) {
    if (this.searchstate === 'inactive' && this.hasValidInput(this.queryString)) {
      this.searchstate = 'active';
      return;
    } else if (target.relatedTarget instanceof HTMLElement) {
      if (target.relatedTarget.className.includes('result')) {
        return;
      }
    }
    this.searchstate = 'inactive';
  }

  // Submit query to search results page
  submitQuery(input: string) {
    if (this.searchstate === 'active') {
      this.searchstate = 'inactive';
    }
    this.router.navigate(['/browse/search'], { queryParams: { q: input, navFilter: this.navFilter } });
  }

  isCorrectCategory(filter: string) {
    return (filter === this.navFilter || this.navFilter === 'all');
  }

  // Hack because blur on input will cancel router link apparently.
  closeDropDown() {
    this.searchstate = 'inactive';
  }

  dbOnly(id: string) {
    return id.split(":")[0];
  }
}
