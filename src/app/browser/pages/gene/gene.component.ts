import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { AnnotationService } from '../../services/annotation/annotation.service';
import {GeneService} from '../../services/gene/gene.service';
import { Disease, EntrezGene, Gene, SimpleTerm, Term } from '../../models/models';
import {ActivatedRoute, Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
//import * as ProtVista from 'ProtVista';
import {environment} from '../../../../environments/environment';
import {DialogService} from '../../../shared/dialog-excel-download/dialog.service';

@Component({
  selector: 'app-gene',
  templateUrl: './gene.component.html',
  styleUrls: ['./gene.component.css', '../../../../../node_modules/ProtVista/style/main.css'],
  encapsulation: ViewEncapsulation.None
})
export class GeneComponent implements OnInit {
  entrezGene: EntrezGene = new EntrezGene();
  gene: string;
  query: string;
  uniprotId = '';
  termAssoc: Term[] = [];
  diseaseAssoc: Disease[] = [];
  termDataSource: MatTableDataSource<Term>;
  diseaseDataSource;
  termColumns = ['id', 'name'];
  diseaseColumns = ['id', 'name'];
  isLoading = true;
  uniProtWidgetInitilized = false;
  uniProtLoading = false;
  uniProtWidgetURL = environment.HPO_UNIPROT_WIDGET_URL;
  mobile = false;
  entrezError = false;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('termPaginator', {static: true}) termPaginator: MatPaginator;
  @ViewChild('diseasePaginator', {static: true}) diseasePaginator: MatPaginator;

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

  // uniprotWidgetInit() {
  //   this.uniProtLoading = true;
  //   // Make service call for Mapping  EntrezId to UniProtKB Accession
  //   this.geneService.searchUniprot(this.query).subscribe((uniprotId) => {
  //     if (uniprotId != null) {
  //       // UniprotVista Viewer if identifier found.
  //       const protVistaDiv = document.getElementsByClassName('ProtVistaReference');
  //       new ProtVista(
  //         {
  //           el: protVistaDiv[0],
  //           uniprotacc: uniprotId,
  //           categoryOrder: ['DOMAINS_AND_SITES', 'VARIATION', 'PTM', 'PROTEOMICS'],
  //           exclusions: ['ANTIGEN', 'MOLECULE_PROCESSING']
  //         });
  //       this.uniprotId = uniprotId;
  //     } else {
  //       this.uniprotId = 'error';
  //     }
  //     this.uniProtLoading = false;
  //   }, (error) => {
  //     // TODO: Implement Better Error Handling
  //     console.log(error);
  //   });
  //   this.uniProtWidgetInitilized = true;
  // }

  /**
   * Initialize tab components where needed
   */
  initTabs(event) {
    // initialize uniProt widget
    if (event.index === 0 && !this.uniProtWidgetInitilized) {
      //this.uniprotWidgetInit();
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
