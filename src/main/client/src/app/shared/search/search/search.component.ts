import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Disease, Gene, Term } from '../../../browser/models/models';
import { SearchService } from '../service/search.service';

import {
  trigger,
  state,
  style,
  animate,
  transition, group
} from '@angular/animations';
import { Subject , pipe } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'searchbar',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [
    trigger('searchState', [
      state('inactive', style({
        'height': 0,
        'overflow-y': 'hidden',
        'visibility': 'hidden'
      })),
      state('active',   style({
        'max-height': '500px',
        'overflow-y': 'scroll',
        'visibility': 'visible'
      })),
      transition('inactive => active',
        animate('350ms ease-in-out')),
      transition('active => inactive',
        animate('200ms ease-in-out'))
    ])
  ]
})
export class SearchComponent implements OnInit {
  terms: Term[] = [];
  diseases: Disease[] = [];
  genes: Gene[] = [];
  termsCount: number;
  diseasesCount: number;
  genesCount: number;
  searchstate = 'inactive';
  query = new Subject();
  queryString = '';
  navFilter = 'all';
  queryText: string;
  notFoundFlag = false;

  @ViewChild('searchbar') searchBar: ElementRef;

  constructor(private router: Router, private searchService: SearchService) {
    this.router = router;
  }

  ngOnInit() {
    this.query.pipe(debounceTime(425),
      distinctUntilChanged()).subscribe((val: string) => {
      if (this.hasValidInput(val)) {
        this.queryText = val;
        this.searchService.searchAll(val).subscribe((data) => {
          this.terms = data.terms;
          this.diseases = data.diseases;
          this.genes = data.genes;
          this.termsCount = data.termsTotalCount;
          this.diseasesCount = data.diseasesTotalCount;
          this.genesCount = data.genesTotalCount;
          this.notFoundFlag = (this.termsCount === 0 && this.diseasesCount === 0 && this.genesCount === 0);
          this.searchstate = 'active';
        }, (error) => {
          // TODO: Implement Better Error Handling
          console.log(error);
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

  toggleDropdown() {
    if (this.searchstate === 'inactive' && this.hasValidInput(this.queryString)) {
      this.searchstate = 'active';
      return;
    }
    this.searchstate = 'inactive';
  }

  // Submit query to search results page
  submitQuery(input: string) {
    if (this.searchstate === 'active') {
      this.searchstate = 'inactive';
    }
    this.router.navigate(['/browse/search'], {queryParams: {q: input, navFilter: this.navFilter}});
  }

  isCorrectCategory(filter: string) {
    return (filter === this.navFilter || this.navFilter === 'all');
  }

}
