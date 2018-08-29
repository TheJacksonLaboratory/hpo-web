import { Component, OnInit, HostListener } from '@angular/core';
import {Disease, Gene, Term} from "../../../browse/models/models";
import {SearchService} from "../service/search.service";
import {Router} from "@angular/router";
import {
  trigger,
  state,
  style,
  animate,
  transition, group
} from '@angular/animations';
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/debounceTime";

@Component({
  selector: 'searchbar',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  animations: [
    trigger('searchState', [
      state('inactive', style({
        'height': 0,
        'overflow-y': "hidden",
        'visibility': 'hidden'
      })),
      state('active',   style({
        'height': '*',
        'overflow-y': "hidden",
        'visibility': 'visible'
      })),
      transition('inactive => active',
        animate('350ms ease-in-out')),
      transition('active => inactive',
        animate('400ms ease-in-out'))
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
  searchstate: string = "inactive";
  query = new Subject();
  navFilter: string = "all";
  highlightText: string;

  constructor(private router: Router, private searchService: SearchService) {
    this.router = router;
  }



  ngOnInit() {
    this.query.debounceTime(650).subscribe((val: string) => {
      if(val && val.length > 3){
        this.highlightText = val;
        this.searchService.searchAll(val).subscribe((data) => {
          this.searchstate = "active";
          this.terms = data.terms;
          this.diseases = data.diseases;
          this.genes = data.genes;
          this.termsCount = data.termsTotalCount;
          this.diseasesCount = data.diseasesTotalCount;
          this.genesCount = data.genesTotalCount;
        }, (error) => {
          // TODO: Implement Better Error Handling
          console.log(error);
        });
      }else{
        this.searchstate = "inactive";
      }
    }); //End debounce subscribe
  }
  @HostListener('document:click', ['$event'])
  documentClick(event: Event): void {
    if(this.searchstate == "active") {
      this.searchstate = "inactive";
    }
  }

  contentChanging(input: string) {
      this.query.next(input);
  }

  setQuery(term: string): void {
    this.contentChanging(term);
  }

  submitQuery(input: string){ // Goes to the big search page
    if(this.searchstate == "active") {
      this.searchstate = "inactive";
    }
    this.router.navigate(["/browse/search"], {queryParams: {q: input, navFilter: this.navFilter}});
  }
}
