import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material';

import { Disease,Gene,Term } from '../../models/models';
import { TermAssocDB, GeneAssocDB} from '../../models/associations/datasources/associations-db'
import { TermAssocDatasource } from '../../models/associations/datasources/term-assoc-datasource'
import { GeneAssocDatasource} from '../../models/associations/datasources/gene-assoc-datasource'
import { DiseaseService } from '../../services/disease/disease.service';

@Component({
  selector: 'app-disease',
  templateUrl: './disease.component.html',
  styleUrls: ['./disease.component.css']
})
export class DiseaseComponent implements OnInit {
  query: string;
  disease: Disease = {"db":"", "dbObjectId": "0", "dbName":"", "dbReference": ""};
  termColumns = ['ontologyId','name', 'definition'];
  geneColumns = ['entrezGeneId', 'entrezGeneSymbol'];
  termSource: TermAssocDatasource |  null;
  geneSource: GeneAssocDatasource | null;
  termAssoc: TermAssocDB;
  geneAssoc: GeneAssocDB;
  isLoading: boolean = true;
  catTermSources = [];
  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute, private diseaseService: DiseaseService) {
    this.route.params.subscribe( (params) => {
      this.query = params.id;
      this.refreshData();
    });
  }

  ngOnInit() {
  }

  refreshData(){
    this.diseaseService.searchDisease(this.query)
      .subscribe((data)=>{
        this.disease  = data.disease;
        this.setCatTermsDBSource (data.catTermsMap);
        this.termAssoc = new TermAssocDB(data.termAssoc);
        this.termSource = new TermAssocDatasource(this.termAssoc, this.sort);
        this.geneAssoc = new GeneAssocDB(data.geneAssoc);
        this.geneSource = new GeneAssocDatasource(this.geneAssoc, this.sort);
        this.isLoading = false;
      }, (error) => {
        console.log(error);
      });
  }
  /**
   * Sets DB sources for Category-Term map data
   */
  setCatTermsDBSource(catTermsMap){
    for (let i in catTermsMap) {
      let catLabel = catTermsMap[i].catLabel;
      let annotationCount = catTermsMap[i].terms.length;
      let termAssoc = new TermAssocDB(catTermsMap[i].terms);
      let termSource = new TermAssocDatasource(termAssoc, this.sort);;
      this.catTermSources.push({catLabel, annotationCount,  termSource});
    }
    this.catTermSources.sort((a, b) => {
      if (a.annotationCount > b.annotationCount) return -1;
      else if (a.annotationCount < b.annotationCount) return 1;
      else return 0;
    });
  }
}
