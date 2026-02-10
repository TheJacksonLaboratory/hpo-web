import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Disease, Gene, Term } from '../../browser/models/models';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UtilityService } from '../utility/utility.service';
import { SearchComponent } from '../search/search/search.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar-hpo',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    SearchComponent
  ],
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

  constructor(private router: Router, public utility: UtilityService) {}

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

  @HostListener('document:click')
  documentClick(): void {
    if (this.searchstate === 'active') {
      this.searchstate = 'inactive';
      this.query = '';
    }
  }

  navigateToDocs() {
    window.open("https://ontology.jax.org/", "__blank");
  }


  navOpen() {
    this.navToggle.emit(true);
  }
}