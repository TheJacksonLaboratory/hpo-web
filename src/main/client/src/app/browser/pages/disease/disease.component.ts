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
  catTermsMap: {"catLabel":string, "terms":Term[]};
  catTermSources= [];
  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute, private diseaseService: DiseaseService) {
    this.route.params.subscribe( params => this.query = params.id);
  }

  ngOnInit() {
    this.diseaseService.searchDisease(this.query)
    .then((data)=>{
      this.disease  = data.disease;
      this.catTermsMap = data.catTermsMap;
      this.setCatTermsDBSource ();
      this.termAssoc = new TermAssocDB(data.termAssoc);
      this.termSource = new TermAssocDatasource(this.termAssoc, this.sort);
      this.geneAssoc = new GeneAssocDB(data.geneAssoc);
      this.geneSource = new GeneAssocDatasource(this.geneAssoc, this.sort)
      this.isLoading = false;
    }, (error) => {
      console.log(error);
    });
  }

  /**
   * Sets DB sources for Category-Term map data
   */
  setCatTermsDBSource(){

    for (let i in this.catTermsMap) {

      var catLabel = this.catTermsMap[i].catLabel
      var annotationCount = this.catTermsMap[i].terms.length
      var termAssoc = new TermAssocDB(this.catTermsMap[i].terms);
      var termSource = new TermAssocDatasource(termAssoc, this.sort);
      var annotationCountTxt = "(1 annotation)"
      annotationCountTxt = annotationCount > 1? "(" + annotationCount + " annotations)" : annotationCountTxt;
      this.catTermSources.push({catLabel, annotationCountTxt,  termSource});
    }
  }
}
