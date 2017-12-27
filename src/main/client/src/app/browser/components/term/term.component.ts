import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Term, TermTree} from '../../models/models';
import { TermService } from '../../services/term/term.service';
import { DiseaseAssocDB,GeneAssocDB } from '../associations/datasources/associations-db';
import { GeneAssocDatasource } from '../associations/datasources/gene-assoc-datasource';
import { DiseaseAssocDatasource } from '../associations/datasources/disease-assoc-datasource';
import { MatSort } from '@angular/material';
@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})
export class TermComponent implements OnInit {
  termTitle: string;
  query: string;
  term: Term = {"id":"", "name": "", "definition":"", "altTermIds": [], "comment":"", "synonyms": [], "isObsolete": true, "xrefs": [], "purl": ""};
  geneColumns = ['entrezGeneId','dbDiseases'];
  diseaseColumns = ['diseaseId', 'diseaseName', 'dbGenes'];
  geneAssoc: GeneAssocDB;
  diseaseAssoc: DiseaseAssocDB;
  geneSource: GeneAssocDatasource | null;
  diseaseSource: DiseaseAssocDatasource | null;
  treeData: TermTree;
  assocLoadingD: boolean = true;
  assocLoadingG: boolean = true;
  toolTipPosition: "above";
  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute, private termService: TermService) {
    this.route.params.subscribe( params => {
      this.refreshData(params.id)
    });
  }

  ngOnInit() {
  }
  refreshData(query: string){
    this.assocLoadingD = true;
    this.assocLoadingG = true;
    this.termService.searchTerm(query)
      .then((data) => {
        //debugger;
        this.setDefaults(data.details);
        this.treeData = data.relations;
        this.termTitle = "(" + this.term.id + ")" + " " + this.term.name;
      }, (error) => {
        console.log(error);
    });
    this.termService.searchDiseasesByTerm(query)
      .then((data) =>{
        this.diseaseAssoc = new DiseaseAssocDB(data.diseases);
        this.diseaseSource = new DiseaseAssocDatasource(this.diseaseAssoc, this.sort);
        this.assocLoadingD = false;
      });
    this.termService.searchGenesByTerm(query)
      .then((data) =>{
        this.geneAssoc = new GeneAssocDB(data.genes);
        this.geneSource = new GeneAssocDatasource(this.geneAssoc, this.sort);
        this.assocLoadingG = false;
      });
  }

  setDefaults(term: Term){
    this.term = term;
    this.term.altTermIds = (term.altTermIds.length != 0) ? term.altTermIds: ["-"];
    this.term.synonyms = (term.synonyms.length != 0) ? term.synonyms: ["-"];
    this.term.definition = (term.definition != null) ? term.definition: "Sorry this term has no definition.";
    this.term.purl = "http://purl.obolibrary.org/obo/" + term.id.replace(":","_");
  }

}




