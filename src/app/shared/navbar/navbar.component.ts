import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {SearchService} from '../search/service/search.service';
import {Disease, Gene, Term} from '../../browser/models/models';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-navbar-hpo',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
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

  navigateToDocs() {
    window.open("https://ontology.jax.org/", "__blank");
  }
}
