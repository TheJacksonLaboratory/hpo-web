import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router'

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css']
})
export class BrowserComponent implements OnInit {
  pageTitle: string;
  pageIntro: string;
  currentLocation: string;
  activeSearch: boolean;
  hideSearch: boolean;
  constructor(private router: Router) {
    this.pageTitle = 'Human Phenotype Browser';
    this.pageIntro = '';
    this.activeSearch = false;
    this.hideSearch = false;
    this.router.events.subscribe((val) => {
      
      if(val instanceof NavigationEnd){
        if(val.url != '/browser'){
          this.hideSearch = true;
        }
        else{
           this.hideSearch = false;
        }
      }
    });
  }
  searchActive(state: boolean) {
    this.activeSearch = state;
  }

  ngOnInit() {
    
  }

}
