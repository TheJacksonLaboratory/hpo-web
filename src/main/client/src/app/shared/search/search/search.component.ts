import { Component, OnInit, HostListener } from '@angular/core';
import {Disease, Gene, Term} from "../../../browse/models/models";
import {SearchService} from "../service/search.service";
import {
  trigger,
  state,
  style,
  animate,
  transition, group
} from '@angular/animations';

@Component({
  selector: 'newsearchbar',
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
        animate('500ms ease-in-out')),
      transition('active => inactive',
        animate('400ms ease-in-out'))
    ])
  ]
})
export class SearchComponent implements OnInit {
  terms: Term[] = [];
  diseases: Disease[] = [];
  genes: Gene[] = [];
  searchstate: string = "inactive";
  query: string = "";
  navFilter: string = "all";
  constructor(private searchService: SearchService) { }

  ngOnInit() {
  }
  @HostListener('document:click', ['$event'])
  documentClick(event: Event): void {
    if(this.searchstate == "active") {
      this.searchstate = "inactive";
      this.query = "";
    }
  }
  suggestContent(query: string): void {
    if(query){
      if(query.length >= 3 ){
        this.query = query;
        this.searchService.searchAll(query).subscribe((data) => {
          this.searchstate = "active";
          this.terms = data.terms;
          this.diseases = data.diseases;
          this.genes = data.genes;
        }, (error) => {
          // TODO: Implement Better Error Handling
          console.log(error);
        });
      }else{
        this.searchstate = "inactive";
      }
    }
  }

  setQuery(term: string): void {
    this.query = term;
    this.suggestContent(term);
  }


}
