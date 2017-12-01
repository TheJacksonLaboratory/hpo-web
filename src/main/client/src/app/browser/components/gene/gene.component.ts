import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneEntrezService } from '../../services/gene/gene-entrez.service';
import { GeneService } from '../../services/gene/gene.service';
import { Gene, EntrezGene } from '../../models/models';
import { ActivatedRoute } from '@angular/router';
import { TermAssocDB, DiseaseAssocDB} from '../associations/datasources/associations-db'
import { TermAssocDatasource } from '../associations/datasources/term-assoc-datasource'
import { DiseaseAssocDatasource} from '../associations/datasources/disease-assoc-datasource'
import { MatSort } from '@angular/material';
@Component({
  selector: 'app-gene',
  templateUrl: './gene.component.html',
  styleUrls: ['./gene.component.css']
})
export class GeneComponent implements OnInit {
  geneTitle: string;
  geneInfo: object;
  entrezGene: EntrezGene = new EntrezGene();
  gene: Gene;
  query: string;
  termSource: TermAssocDatasource |  null
  diseaseSource: DiseaseAssocDatasource | null
  termAssoc: TermAssocDB
  diseaseAssoc: DiseaseAssocDB
  termColumns = ['ontologyId','name'];
  diseaseColumns = ['diseaseId', 'diseaseName']
  
  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute, private geneEntrezService: GeneEntrezService, private geneService: GeneService) {
    this.route.params.subscribe( params => this.query = params.id);
    this.entrezGene.otheraliases = '';
  }

  ngOnInit() {
    this.geneEntrezService.searchGeneInfo(this.query)
      .then((data) => {
        this.entrezGene = data.result[this.query];
        this.entrezGene.aliases = this.entrezGene.otheraliases.split(",");
      }, (error) => {
        console.log(error);
    });
    
    this.geneService.searchGene(this.query)
    .then((data)=> {
      this.termAssoc = new TermAssocDB(data.termAssoc)
      this.termSource = new TermAssocDatasource(this.termAssoc, this.sort);
      this.diseaseAssoc = new DiseaseAssocDB(data.diseaseAssoc)
      this.diseaseSource = new DiseaseAssocDatasource(this.diseaseAssoc, this.sort)
    },(error)=>{
        console.log(error);
    });
  }
}
