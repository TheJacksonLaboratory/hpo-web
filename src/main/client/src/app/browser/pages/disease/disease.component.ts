import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { Disease, Gene, Term, TermCategory } from '../../models/models';
import { DiseaseService } from '../../services/disease/disease.service';
import { DialogService } from '../../../shared/dialog-excel-download/dialog.service';

@Component({
  selector: 'app-disease',
  templateUrl: './disease.component.html',
  styleUrls: ['./disease.component.css']
})
export class DiseaseComponent {
  query: string;
  disease: Disease = {'db': '', 'dbObjectId': '0', 'dbName': '', 'dbReference': ''};
  termAssoc: Term[] = [];
  geneAssoc: Gene[] = [];
  termColumns = ['ontologyId', 'name', 'onset', 'frequency', 'citations' ];
  hasTerms = false;
  geneColumns = ['entrezGeneId', 'entrezGeneSymbol'];
  termDataSource: MatTableDataSource<Term>;
  geneDataSource: MatTableDataSource<Gene>;
  isLoading  = true;
  catTermSources: TermCategory[] = [];
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @ViewChild('genePaginator', { static: true }) genePaginator: MatPaginator;

  constructor(private route: ActivatedRoute, private diseaseService: DiseaseService, public dialogService: DialogService,
              private router: Router) {
    this.route.params.subscribe( (params) => {
      this.query = params.id;
      this.refreshData();
    });
  }

  refreshData() {
    this.diseaseService.searchDisease(this.query)
      .subscribe((data) => {
        this.disease  = data.disease;
        this.geneAssoc = data.geneAssoc;
        this.catTermSources = [];
        this.setCatTermsDBSource (data.catTermsMap);
        this.geneDataSource = new MatTableDataSource(this.geneAssoc);

        this.geneDataSource.paginator = this.genePaginator;
        this.diseaseService.searchMonarch(this.query)
          .subscribe((mData) => {
            this.disease.description = mData.description;
          });
        this.isLoading = false;
      }, (error) => {
        const errorString = 'Could not find requested disease id.';
        this.router.navigate(['/error'], {
          state: {
            description: errorString
          }});
        console.log(error);
      });

  }
  /**
   * Sets DB sources for Category-Term map data
   */
  setCatTermsDBSource(catTermsMap) {
    catTermsMap.map( term => {
      const catLabel = term.catLabel;
      const annotationCount = term.terms.length;
      if (term.terms.length > 0) {
        this.hasTerms = true;
      }
      const catTermSource = term.terms.map( fterm => {
        fterm.frequency = fterm.frequency === 'UNKNOWN' ? '-' : fterm.frequency;
        fterm.onset = fterm.onset === 'UNKNOWN' ? '-' : fterm.onset;
        fterm.citations = this.formatCitations(fterm.citations);
        return fterm;
      });
      const termSource = new MatTableDataSource(catTermSource);
      this.catTermSources.push({catLabel, annotationCount,  termSource});
    });

    this.catTermSources.sort((a, b) => (a.annotationCount > b.annotationCount) ? -1 :
      (a.annotationCount < b.annotationCount) ? 1 : 0);
  }

  formatCitations(citations: string) {
    const formattedCitations = citations.split(',');
    if (formattedCitations[0] === 'UNKNOWN') {
       formattedCitations[0] = '-' ;
    }
    return formattedCitations;
  }

  applyGeneFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.geneDataSource.filter = filterValue;
  }

  downloadDialog() {
    const counts = {
      genes: this.geneAssoc.length,
      terms: this.termAssoc.length
    };
    this.dialogService.openDownloadDialog(this.disease.diseaseId, 'disease', counts);
  }
}
