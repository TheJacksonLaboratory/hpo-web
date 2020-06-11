import {Component, OnInit, ViewChild} from '@angular/core';
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { startWith } from "rxjs/internal/operators/startWith";
import {catchError, debounceTime, map} from "rxjs/operators";
import { TermService } from "../../services/term/term.service";
import { switchMap } from "rxjs/internal/operators/switchMap";
import {SearchService} from "../../../shared/search/service/search.service";
import {MatStepper} from "@angular/material/stepper";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Disease, Term} from "../../models/models";
import {of} from "rxjs/internal/observable/of";

@Component({
  selector: 'app-custom',
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.scss']
})
export class CustomComponent implements OnInit {

  @ViewChild('stepper') private stepper: MatStepper;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  myControl = new FormControl();
  filteredOptions: Observable<[]>;
  selectedTerms: Term[] = [];
  submittedTerms = false;
  associationData;
  loadingIntersectingAssociations = false;
  intersectingAssocationError = false;
  displayedColumns: string[] = ['diseaseId', 'diseaseName'];
  resultsLength = 0;

  constructor(private searchService: SearchService, private termService: TermService) { }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        switchMap(val => this.searchService.searchAll(val)),
        map(response => response.terms)
      );
  }

  addTerm(term: any){
    this.selectedTerms.push(term);
  }

  removeTerm(index: number){
    this.selectedTerms.splice(index);
  }

  submitTerms() {
    // Fire Analysis
    // Move to next step
    this.stepper.next();
    this.submittedTerms = true;
    this.loadingIntersectingAssociations = true;
    console.log(this.selectedTerms);
    let termIds = this.selectedTerms.map(term => term.ontologyId);
    this.termService.searchIntersectingAnnotations(termIds).pipe(
      map(data => {
        // Flip flag to show that loading has finished.
        this.loadingIntersectingAssociations = false;
        this.resultsLength = data.length;
        return data.associations;
      }),
      catchError(() => {
        this.intersectingAssocationError = true;
        this.loadingIntersectingAssociations = false;
        return of([]);
      })
    ).subscribe(data => this.associationData = data);
  }
}
