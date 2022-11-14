import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {SearchService} from '../search/service/search.service';
import {Disease, Gene, Term} from '../../browser/models/models';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'navbar-hpo',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('searchState', [
      state('inactive', style({
        'height': 0,
        'overflow-y': 'hidden'
      })),
      state('active', style({
        'height': '*',
        'overflow-y': 'hidden'
      })),
      transition('inactive => active',
        animate('500ms ease-in-out')),
      transition('active => inactive',
        animate('400ms ease-in-out'))
    ])
  ]
})
export class NavbarComponent implements OnInit {
  title = 'Human Phenotype Ontology';
  query = '';
  showSearch = false;
  navFilter = 'all';
  terms: Term[] = [];
  diseases: Disease[] = [];
  genes: Gene[] = [];
  searchstate = 'inactive';
  @Output() navToggle = new EventEmitter();

  navOpen() {
    this.navToggle.emit(true);
  }

  constructor(private router: Router, private searchService: SearchService) {

  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url !== '/') {
          this.showSearch = true;
        } else {
          this.showSearch = false;
          this.terms = [];
          this.diseases = [];
          this.genes = [];
          this.query = '';
        }
      }
    });
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: Event): void {
    if (this.searchstate === 'active') {
      this.searchstate = 'inactive';
      this.query = '';
    }
  }

  suggestContent(query: string): void {
    if (query && query.length >= 3) {
      this.query = query;
      this.searchService.searchAll(query).subscribe((data) => {
        this.searchstate = 'active';
        this.terms = data.terms;
        this.diseases = data.diseases;
        this.genes = data.genes;
      }, (error) => {
        // TODO: Implement Better Error Handling
        console.log(error);
      });
    } else {
      this.searchstate = 'inactive';
    }
  }

  navigateToDocs() {
    window.open("/api/hpo/docs", "__blank");
  }
}
