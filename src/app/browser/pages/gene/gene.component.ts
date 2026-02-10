import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnotationService } from '../../services/annotation/annotation.service';
import { GeneService } from '../../services/gene/gene.service';
import { Disease, EntrezGene, SimpleTerm, Term } from '../../models/models';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
//import * as ProtVista from 'ProtVista';
import { environment } from '../../../../environments/environment';
import { DialogService } from '../../../shared/dialog-excel-download/dialog.service';

import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-gene',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatProgressBarModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './gene.component.html',
  styleUrls: ['./gene.component.css', '../../../../../node_modules/ProtVista/style/main.css'],
  encapsulation: ViewEncapsulation.None
})
export class GeneComponent implements OnInit {
  entrezGene: EntrezGene = new EntrezGene();
  gene: string;
  query: string;
  uniprotId = '';
  termAssoc: SimpleTerm[] = [];
  diseaseAssoc: Disease[] = [];
  termDataSource: MatTableDataSource<SimpleTerm>;
  diseaseDataSource;
  termColumns = ['id', 'name'];
  diseaseColumns = ['id', 'name'];
  isLoading = true;
  uniProtWidgetInitilized = false;
  uniProtLoading = false;
  uniProtWidgetURL = environment.HPO_UNIPROT_WIDGET_URL;
  mobile = false;
  entrezError = false;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('termPaginator', { static: true }) termPaginator: MatPaginator;
  @ViewChild('diseasePaginator', { static: true }) diseasePaginator: MatPaginator;

  constructor(private route: ActivatedRoute, private geneService: GeneService,
              private annotationService: AnnotationService,
              public dialogService: DialogService,
              private router: Router) {

  }

  ngOnInit() {
    if (window.screen.width < 767) { // 768px portrait
      this.mobile = true;
    }

    this.route.params.subscribe((params) => {
      this.gene = params.id;
      this.reloadGeneData();
    });
  }

  reloadGeneData() {
    const id = this.gene.split(":")[1];
    this.geneService.searchGeneInfo(id)
      .subscribe((data) => {
        this.entrezGene = data.result[id];
        this.entrezGene.aliases = this.entrezGene.otheraliases ? this.entrezGene.otheraliases.split(',') : [];
        this.entrezGene.summary = this.entrezGene.summary ? this.entrezGene.summary : 'No Entrez definition entry.';
      }, (error) => {
        this.entrezError = true;
        console.log(error);
      });

    this.annotationService.fromGene(this.gene)
      .subscribe((data) => {
        this.termAssoc = data.phenotypes;
        this.diseaseAssoc = data.diseases;

        this.termDataSource = new MatTableDataSource(this.termAssoc);
        this.diseaseDataSource = new MatTableDataSource(this.diseaseAssoc);

        this.termDataSource.paginator = this.termPaginator;
        this.diseaseDataSource.paginator = this.diseasePaginator;

        this.isLoading = false;
      }, (error) => {
        const errorString = 'Could not find requested entrez id ' + this.gene + '.';
        this.router.navigate(['/error'], {
          state: {
            description: errorString
          }
        });
        console.log(error);
      });

    if (!this.mobile) {
      ///this.uniprotWidgetInit();
    }
  }

  applyTermFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.termDataSource.filter = filterValue;
  }

  applyDiseaseFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.diseaseDataSource.filter = filterValue;
  }

  downloadDialog() {
    const counts = {
      diseases: this.diseaseAssoc.length,
      terms: this.termAssoc.length
    };
    this.dialogService.openDownloadDialog(this.gene, counts);
  }

}
