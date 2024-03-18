import {Router} from '@angular/router';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Disease, Gene, SimpleTerm, Term } from '../../../browser/models/models';
import {SearchService} from '../service/search.service';

import {animate, state, style, transition, trigger} from '@angular/animations';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
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
        'max-height': '500px',
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

  @ViewChild('searchbar', {static: true}) searchBar: ElementRef;

  constructor(private router: Router, private searchService: SearchService) {
    this.router = router;
  }

  ngOnInit() {
    this.query.pipe(debounceTime(1000),
      distinctUntilChanged()).subscribe((val: string) => {
      if (this.hasValidInput(val)) {
        this.loadingSearchResults = true;
        this.queryText = val


        this.searchService.searchAll(val).subscribe(({terms, genes, diseases}) => {
          this.terms = terms.terms;
          this.diseases = diseases.results;
          this.genes = genes.results;
          this.termsCount = terms.totalCount;
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

  toggleDropdown(target: any) {
    if (this.searchstate === 'inactive' && this.hasValidInput(this.queryString)) {
      this.searchstate = 'active';
      return;
    } else if (target.relatedTarget != null) {
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
    this.router.navigate(['/browse/search'], {queryParams: {q: input, navFilter: this.navFilter}});
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
