import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';


@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit {
  pageTitle: String;
  pageIntro: String;
  routerSub: any;
  constructor(private router: Router, private route: ActivatedRoute) { 
    this.pageIntro = "This documentation provides structure to find what you're looking for quickly.";  
    this.pageTitle = "Documentation";

  }

  ngOnInit() {
    
  }
  ngOnDestroy(){
  }

}
