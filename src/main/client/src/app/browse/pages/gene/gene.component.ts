import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { GeneService } from '../../services/gene/gene.service';
import { Gene, EntrezGene, Term, Disease } from '../../models/models';
import { ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material';
import { MatTableDataSource, MatPaginator} from '@angular/material';
import * as ProtVista from 'ProtVista';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-gene',
  templateUrl: './gene.component.html',
  styleUrls: ['./gene.component.css','../../../../../node_modules/ProtVista/style/main.css'],
  encapsulation: ViewEncapsulation.None
})
export class GeneComponent implements OnInit {
  entrezGene: EntrezGene = new EntrezGene();
  gene: Gene;
  query: string;
  uniprotId: string = "";
  termAssoc: Term[]=[];
  diseaseAssoc: Disease[]=[];
  termDataSource : MatTableDataSource<Term>;
  diseaseDataSource : MatTableDataSource<Disease>;
  termColumns = ['ontologyId', 'name', 'definition'];
  diseaseColumns = ['diseaseId', 'diseaseName'];
  isLoading: boolean = true;
  uniProtWidgetInitilized =false;
  uniProtLoading = false;
  uniProtWidgetURL = environment.HPO_UNIPROT_WIDGET_URL;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('termPaginator') termPaginator: MatPaginator;
  @ViewChild('diseasePaginator') diseasePaginator: MatPaginator;

  constructor(private route: ActivatedRoute, private geneService: GeneService) {
    this.route.params.subscribe((params) => {
      this.query = params.id;
      this.reloadGeneData();
    });
  }

  ngOnInit() {
  }

  reloadGeneData(){
    this.geneService.searchGeneInfo(this.query)
      .subscribe((data) => {
        this.entrezGene = data.result[this.query];
        this.entrezGene.aliases = this.entrezGene.otheraliases.split(",");
        this.entrezGene.summary = this.entrezGene.summary ? this.entrezGene.summary: "No Entrez definition entry."
      }, (error) => {
        // TODO: Implement Better Error Handling
        console.log(error);
      });
    this.geneService.searchGene(this.query)
      .subscribe((data) => {
        this.termAssoc = data.termAssoc;
        this.diseaseAssoc = data.diseaseAssoc;

        this.termDataSource = new MatTableDataSource(this.termAssoc);
        this.diseaseDataSource = new MatTableDataSource(this.diseaseAssoc);

        this.termDataSource.paginator = this.termPaginator;
        this.diseaseDataSource.paginator = this.diseasePaginator;

        this.isLoading = false;
      }, (error) => {
        // TODO: Implement Better Error Handling
        console.log(error);
      });
    this.uniprotWidgetInit();
  }
  uniprotWidgetInit() {

    this.uniProtLoading = true;
    // Make service call for Mapping  EntrezId to UniProtKB Accession
    this.geneService.searchUniprot(this.query).subscribe((uniprotId) => {
      if (uniprotId != null) {
        // UniprotVista Viewer if identifier found.
        let protVistaDiv = document.getElementsByClassName('ProtVistaReference');
        new ProtVista(
          {
            el: protVistaDiv[0],
            uniprotacc: uniprotId,
            categoryOrder: ['DOMAINS_AND_SITES', 'VARIATION', 'PTM', 'PROTEOMICS'],
            exclusions: ['ANTIGEN', 'MOLECULE_PROCESSING']
          });
        this.uniprotId = uniprotId;
      } else {
        this.uniprotId = "error";
      }
      this.uniProtLoading = false;
    }, (error) => {
      // TODO: Implement Better Error Handling
      console.log(error);
    });
    this.uniProtWidgetInitilized =true;
  }

  /**
   * Initialize tab components where needed
   */
  initTabs(event) {
      //initialize uniProt widget
      if (event.index == 0 && ! this.uniProtWidgetInitilized ){
        this.uniprotWidgetInit();
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

}
