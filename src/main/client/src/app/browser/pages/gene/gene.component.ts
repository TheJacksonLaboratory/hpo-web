import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { GeneService } from '../../services/gene/gene.service';
import { Gene, EntrezGene } from '../../models/models';
import { ActivatedRoute } from '@angular/router';
import { TermAssocDB, DiseaseAssocDB} from '../../models/associations/datasources/associations-db'
import { TermAssocDatasource } from '../../models/associations/datasources/term-assoc-datasource'
import { DiseaseAssocDatasource} from '../../models/associations/datasources/disease-assoc-datasource'
import { MatSort } from '@angular/material';
import * as ProtVista from 'ProtVista';

@Component({
  selector: 'app-gene',
  templateUrl: './gene.component.html',
  styleUrls: ['./gene.component.css','../../../../../node_modules/ProtVista/style/main.css'],
  encapsulation: ViewEncapsulation.None
})
export class GeneComponent implements OnInit {
  geneTitle: string;
  geneInfo: object;
  entrezGene: EntrezGene = new EntrezGene();
  gene: Gene;
  query: string;
  uniprotId:string = "";
  termSource: TermAssocDatasource |  null;
  diseaseSource: DiseaseAssocDatasource | null;
  termAssoc: TermAssocDB;
  diseaseAssoc: DiseaseAssocDB;
  termColumns = ['ontologyId','name'];
  diseaseColumns = ['diseaseId', 'diseaseName'];
  isLoading: boolean = true;

  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute, private geneService: GeneService) {
    this.route.params.subscribe( params => this.query = params.id);
  }
  ngOnInit() {
    this.uniprotWidgetInit();
    this.geneService.searchGeneInfo(this.query)
      .then((data) => {
        this.entrezGene = data.result[this.query];
        this.entrezGene.aliases = this.entrezGene.otheraliases.split(",");
      }, (error) => {
        console.log(error);
    });
    this.geneService.searchGene(this.query)
    .then((data)=> {
      this.termAssoc = new TermAssocDB(data.termAssoc);
      this.termSource = new TermAssocDatasource(this.termAssoc, this.sort);
      this.diseaseAssoc = new DiseaseAssocDB(data.diseaseAssoc);
      this.diseaseSource = new DiseaseAssocDatasource(this.diseaseAssoc, this.sort);
      this.isLoading = false;
    },(error)=>{
        console.log(error);
    });

  }
  uniprotWidgetInit(){
    // Make service call for Mapping  EntrezId to UniProtKB Accession
    this.geneService.searchUniprot(this.query).then((uniprotId) => {
      if(uniprotId){
        // Init ProtVista Viewer if identifier found.
        let protVistaDiv = document.getElementsByClassName('ProtVistaReference');
        new ProtVista(
          { el: protVistaDiv[0],
            uniprotacc : uniprotId,
            categoryOrder: ['DOMAINS_AND_SITES', 'VARIATION', 'PTM','PROTEOMICS'],
            exclusions: ['ANTIGEN','MOLECULE_PROCESSING']
          });
        this.uniprotId = uniprotId;
      }else{
        this.uniprotId = "error";
      }
    }, (error)=>{
      console.log(error);
    });
  }
}
