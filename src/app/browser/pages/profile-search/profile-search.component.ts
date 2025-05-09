import {Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import {UntypedFormControl} from "@angular/forms";
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { AnnotationService } from '../../services/annotation/annotation.service';
import { OntologyService } from '../../services/ontology/ontology.service';
import {MatStepper} from "@angular/material/stepper";
import {MatSort} from "@angular/material/sort";
import { SimpleTerm } from '../../models/models';

@Component({
  selector: 'app-custom',
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.scss']
})
export class ProfileSearchComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild(MatSort) sort: MatSort;

  myControl = new UntypedFormControl();
  filteredOptions: Observable<SimpleTerm[]>;
  selectedTerms: SimpleTerm[] = [];
  submittedTerms = false;
  dataSource: MatTableDataSource<SimpleTerm>;
  associationData;
  loadingIntersectingAssociations = true;
  intersectingAssocationError = false;
  displayedColumns: string[] = ['diseaseId', 'diseaseName'];
  resultsLength = 0;

  constructor(private ontologyService: OntologyService,  private annotationService: AnnotationService) {
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        filter(x => x != null && x != '' && x.length >= 3),
        switchMap(val =>
          this.ontologyService.search(val, 10)
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
    let termIds = this.selectedTerms.map(term => term.id);
    this.annotationService.searchProfile(termIds.join(",")).pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      map(data => {
        this.loadingIntersectingAssociations = false;
        this.resultsLength = data.length;
        return data;
      }),
      catchError(() => {
        this.intersectingAssocationError = true;
        this.loadingIntersectingAssociations = false;
        return of([]);
      })
    ).subscribe(data =>
      this.dataSource = new MatTableDataSource(data)
    );
  }

  applyTermFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  resetStepper() {
    this.stepper.reset();
    this.submittedTerms = false;
    this.selectedTerms = [];
    this.myControl.reset();
  }
}
