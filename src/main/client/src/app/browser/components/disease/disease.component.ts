import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material';

import { Disease,Gene,Term } from '../../models/models';
import { TermAssocDB, GeneAssocDB} from '../associations/datasources/associations-db'
import { TermAssocDatasource } from '../associations/datasources/term-assoc-datasource'
import { GeneAssocDatasource} from '../associations/datasources/gene-assoc-datasource'
import { DiseaseService } from '../../services/disease/disease.service';

@Component({
  selector: 'app-disease',
  templateUrl: './disease.component.html',
  styleUrls: ['./disease.component.css']
})
export class DiseaseComponent implements OnInit {
  query: string;
  disease: Disease;
  termColumns = ['ontologyId','name'];
  geneColumns = ['entrezGeneId', 'entrezGeneSymbol']
  termSource: TermAssocDatasource |  null
  geneSource: GeneAssocDatasource | null
  termAssoc: TermAssocDB
  geneAssoc: GeneAssocDB
  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute, private diseaseService: DiseaseService) { 
    this.route.params.subscribe( params => this.query = params.id);
    this.disease = {"db":"", "dbObjectId": "0", "dbName":"", "dbReference": ""};
  }

  ngOnInit() {
    this.diseaseService.searchDisease(this.query)
    .then((data)=>{
      this.disease  = data.disease;
      this.termAssoc = new TermAssocDB(data.termAssoc)
      this.termSource = new TermAssocDatasource(this.termAssoc, this.sort);
      this.geneAssoc = new GeneAssocDB(data.geneAssoc)
      this.geneSource = new GeneAssocDatasource(this.geneAssoc, this.sort)
    }, (error) => {
      console.log(error);
    });
  }
}
