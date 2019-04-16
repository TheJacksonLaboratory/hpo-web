import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  termColumns = ['ontologyId', 'name', 'definition'];
  geneColumns = ['entrezGeneId', 'entrezGeneSymbol'];
  termDataSource: MatTableDataSource<Term>;
  geneDataSource: MatTableDataSource<Gene>;
  isLoading  = true;
  catTermSources: TermCategory[] = [];
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('genePaginator') genePaginator: MatPaginator;

  constructor(private route: ActivatedRoute, private diseaseService: DiseaseService, public dialogService: DialogService) {
    this.route.params.subscribe( (params) => {
      this.query = params.id;
      this.refreshData();
    });
  }

  refreshData() {
    this.diseaseService.searchDisease(this.query)
      .subscribe((data) => {
        this.disease  = data.disease;
        this.termAssoc = data.termAssoc;
        this.geneAssoc = data.geneAssoc;
        this.setCatTermsDBSource (data.catTermsMap);

        this.termDataSource = new MatTableDataSource(this.termAssoc);
        this.geneDataSource = new MatTableDataSource(this.geneAssoc);

        this.geneDataSource.paginator = this.genePaginator;
        this.isLoading = false;
      }, (error) => {
        console.log(error);
      });
    this.diseaseService.searchMonarch(this.query)
      .subscribe((data) => {
      this.disease.description = data.description;
    });
  }
  /**
   * Sets DB sources for Category-Term map data
   */
  setCatTermsDBSource(catTermsMap) {
    for (let i in catTermsMap) {
      const catLabel = catTermsMap[i].catLabel;
      const annotationCount = catTermsMap[i].terms.length;
      const termSource = new MatTableDataSource(catTermsMap[i].terms);
      this.catTermSources.push({catLabel, annotationCount,  termSource});
    }
    this.catTermSources.sort((a, b) => (a.annotationCount > b.annotationCount) ? -1 :
      (a.annotationCount < b.annotationCount) ? 1 : 0);
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