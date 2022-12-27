import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {UntypedFormControl} from "@angular/forms";
import {catchError, filter, map} from "rxjs/operators";
import {TermService} from "../../services/term/term.service";
import {switchMap} from "rxjs/internal/operators/switchMap";
import {SearchService} from "../../../shared/search/service/search.service";
import {MatStepper} from "@angular/material/stepper";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {Term} from "../../models/models";
import {of} from "rxjs/internal/observable/of";

@Component({
  selector: 'app-custom',
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.scss']
})
export class ProfileSearchComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  myControl = new UntypedFormControl();
  filteredOptions: Observable<[]>;
  selectedTerms: Term[] = [];
  submittedTerms = false;
  associationData;
  loadingIntersectingAssociations = true;
  intersectingAssocationError = false;
  displayedColumns: string[] = ['diseaseId', 'diseaseName'];
  resultsLength = 0;

  constructor(private searchService: SearchService, private termService: TermService) {
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        filter(x => x != null && x != ''),
        switchMap(val =>
          this.searchService.searchAll(val)
        ),
        map(response => response.terms)
      );
  }

  addTerm(term: any) {
    if (!this.selectedTerms.some(existent => existent.id == term.id)) {
      this.selectedTerms.push(term);
    }
  }

  removeTerm(index: number) {
    this.selectedTerms.splice(index);
  }

  submitTerms() {
    this.stepper.next();
    this.submittedTerms = true;
    this.loadingIntersectingAssociations = true;
    let termIds = this.selectedTerms.map(term => term.ontologyId);
    this.termService.searchIntersectingAnnotations(termIds).pipe(
      map(data => {
        // Flip flag to show that loading has finished.
        this.loadingIntersectingAssociations = false;
        this.resultsLength = data.associations.length;
        return data.associations;
      }),
      catchError(() => {
        this.intersectingAssocationError = true;
        this.loadingIntersectingAssociations = false;
        return of([]);
      })
    ).subscribe(data => this.associationData = data);
  }

  resetStepper() {
    this.stepper.reset();
    this.submittedTerms = false;
    this.selectedTerms = [];
    this.myControl.reset();
  }
}
