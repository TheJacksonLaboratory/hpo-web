import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AnnotationService } from '../../services/annotation/annotation.service';
import { LanguageService } from '../../services/language/language.service';
import { EntityType, Language, SimpleTerm, Term, TermTree } from '../../models/models';
import { DialogService } from '../../../shared/dialog-excel-download/dialog.service';
import { OntologyService } from "../../services/ontology/ontology.service";

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})
export class TermComponent implements OnInit {
  termTitle: string;
  query: string;
  paramId: string;
  term: Term;
  geneColumns = ['id', 'name'];
  geneSource: MatTableDataSource<SimpleTerm>;
  geneAssocCount: number;
  geneAssocMax: number;
  geneAssocOffset: number;
  geneDisplayCount: number;

  diseaseColumns = ['id', 'name'];
  diseaseAssocCount: number;
  diseaseAssocMax: number;
  diseaseAssocOffset: number;
  diseaseDisplayCount: number;
  diseaseSource: MatTableDataSource<SimpleTerm>;

  loincSource: MatTableDataSource<SimpleTerm>;
  loincColumns = ['id', 'name'];
  loincDisplayCount: number;

  treeData: TermTree;
  termTreeMainWidth: number;

  assocLoading = true;
  overlay = false;
  languages: Language[];
  selectedLanguage: Language = {language: "en", language_long: "English"};

  @ViewChild('diseasePaginator', {static: true}) diseasePaginator: MatPaginator;
  @ViewChild('genePaginator', {static: true}) genePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute, private ontologyService: OntologyService,
              private annotationService: AnnotationService,
              private dialogService: DialogService,
              private languageService: LanguageService, private router: Router) {
  }

  ngOnInit() {
    this.route.params.pipe(switchMap((params: Params) => {
      const id = params['id'];
      this.assocLoading = true;
      this.overlay = false;
      this.paramId = id;
      this.refreshData(id);
      return this.annotationService.fromPhenotype(id);
    })).subscribe((associations) => {

      this.geneSource = new MatTableDataSource(associations.genes);
      this.geneAssocCount = associations.genes.length;
      this.geneAssocMax = 10000; // fix
      this.geneAssocOffset = 0; // fix
      this.geneDisplayCount = (this.geneAssocCount < this.geneAssocMax) ? this.geneAssocCount :  this.geneAssocMax;

      this.diseaseSource = new MatTableDataSource(associations.diseases);
      this.diseaseAssocCount = associations.diseases.length;
      this.diseaseAssocMax = 10000; // fix
      this.diseaseAssocOffset = 0; // fix
      this.diseaseDisplayCount = (this.diseaseAssocCount < this.diseaseAssocMax) ? this.diseaseAssocCount : this.diseaseAssocMax;
      this.assocLoading = false;
      this.loincSource = new MatTableDataSource(associations.assays);
      this.loincSource.sort = this.sort;
      this.loincDisplayCount = associations.assays.length;
    }, err => {
      // TODO: Implement Better Handling Here
      const errorString = 'Could not find requested ' + this.paramId + '.';
      this.router.navigate(['/error'], {
        state: {
          description: errorString
        }
      });
      console.log(err);
    });
  }

  refreshData(query: string) {
<<<<<<< Updated upstream
    forkJoin( {
      term: this.ontologyService.term(query).pipe(catchError(e => { console.error(e); return of(undefined)})),
      parents: this.ontologyService.parents(query).pipe(catchError(e => of([]))),
      children: this.ontologyService.children(query).pipe(catchError(e => of([])))
    }).subscribe(({term, parents, children}) => {
      this.setDefaults(term);
      const maxTermWidth = 100;
      this.treeData = {parents: parents, children: children, descendantCount: term.descendantCount};
      this.treeData.maxTermWidth = maxTermWidth;
      this.treeData.children.sort((a, b) => a.descendantCount > b.descendantCount ? (-1) : 1);
      this.treeData.children.map(term => {
        const percent = term.descendantCount / this.treeData.descendantCount;
        const newWidth = Math.ceil(maxTermWidth * percent);
        const newMargin = -115 + ((maxTermWidth - newWidth) - 5);
        term.treeCountWidth = newWidth;
        term.treeMargin = newMargin;
      });
      this.termTitle = this.term.name;
=======
    this.ontologyService.term(query).pipe(
      catchError(e => {
        console.error(e);
        return of(undefined)
      })
    ).subscribe((term) => {
      if (term) {
        forkJoin({
          parents: this.ontologyService.parents(term.id).pipe(catchError(() => of([]))),
          children: this.ontologyService.children(term.id).pipe(catchError(() => of([])))
        }).subscribe(({parents, children}) => {
          this.setDefaults(term);
          const maxTermWidth = 100;
          this.treeData = {parents: parents, children: children, descendantCount: term.descendantCount};
          this.treeData.maxTermWidth = maxTermWidth;
          this.treeData.children.sort((a, b) => a.descendantCount > b.descendantCount ? (-1) : 1);
          this.treeData.children.map(term => {
            const percent = term.descendantCount / this.treeData.descendantCount;
            const newWidth = Math.ceil(maxTermWidth * percent);
            const newMargin = -115 + ((maxTermWidth - newWidth) - 5);
            term.treeCountWidth = newWidth;
            term.treeMargin = newMargin;
          });
          this.termTitle = this.term.name;
        }, err => {
          const errorString = 'Could not find requested ' + this.paramId + '.';
          this.router.navigate(['/error'], {
            state: {
              description: errorString
            }
          });
          console.log(err);
        });
      }
>>>>>>> Stashed changes
    });
  }

  setDefaults(term: Term) {
    if (term) {
      this.term = term;
      this.term.comment = (term.comment != null) ? term.comment : '';
      this.term.synonyms = (term.synonyms.length !== 0) ? term.synonyms : ['No synonyms found for this term.'];
      this.term.definition = (term.definition != null) ? term.definition : 'Sorry this term has no definition.';
      this.term.purl = 'http://purl.obolibrary.org/obo/' + term.id.replace(':', '_');
      this.term.xrefs = (term.xrefs != null) ? term.xrefs : [];

      if (term.translations != undefined && term.translations.length > 0){
        // Get unique set of languages
        this.languages = [...new Set(term.translations.map((t) => {
          return {language: t.language, language_long: t.language_long}
        }))];

        // Add english default
        this.languages.unshift(this.languageService.default);

        // If the active language is updated set it.
        this.languageService.active$.subscribe((active) => {
          const exist = this.languages.some(li => li.language == active.language);
          if (exist) {
            this.selectedLanguage = active;
          } else {
            this.languageService.change(this.languageService.default);
          }
        });
      }
    }
  }

  applyDiseaseFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.diseaseSource.filter = filterValue;
  }

  applyGeneFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.geneSource.filter = filterValue;
  }

  downloadDialog() {
    const counts = {
      genes: this.geneAssocCount,
      diseases: this.diseaseAssocCount
    };
    this.dialogService.openDownloadDialog(this.term.id, counts);
  }

  setTreeStyles(child: Term): any {
    return {'width': child.treeCountWidth + 'px', 'margin-left': child.treeMargin + 'px', 'margin-right': '20px'};
  }

  changeLanguage(language){
    this.languageService.change(language);
  }
}




