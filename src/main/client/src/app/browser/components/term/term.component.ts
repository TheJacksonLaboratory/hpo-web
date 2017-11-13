import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Term } from './term';
import { TermService } from '../../services/term/term.service';
import { GeneAssocDB } from './datasources/gene-assoc-db';
import { DiseaseAssocDB } from './datasources/disease-assoc-db';
import { GeneAssocDatasource } from './datasources/gene-assoc-datasource';
import { DiseaseAssocDatasource } from './datasources/disease-assoc-datasource';
import { MatSort } from '@angular/material';
@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})
export class TermComponent implements OnInit {
  termTitle: string;
  query: string;
  term: Term;
  geneColumns = ['entrezGeneId'];
  diseaseColumns = ['dbRef', 'dbName']
  geneAssoc: GeneAssocDB;
  diseaseAssoc: DiseaseAssocDB;
  geneSource: GeneAssocDatasource | null;
  diseaseSource: DiseaseAssocDatasource | null;
  

  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute, private termService: TermService) { 
    this.route.params.subscribe( params => this.query = params.id);
    this.term = {"id":"", "name": "", "definition":"", "altTermIds": [], "comment":"", "synonyms": [], "isObsolete": true, "xrefs": [], "purl": ""};
  }

  ngOnInit() {
    this.termService.searchTerm(this.query)
      .then((data) => {
        this.setDefaults(data.term);
        this.geneAssoc = new GeneAssocDB(data.geneAssoc)
        this.geneSource = new GeneAssocDatasource(this.geneAssoc, this.sort);
        this.diseaseAssoc = new DiseaseAssocDB(data.diseaseAssoc)
        this.diseaseSource = new DiseaseAssocDatasource(this.diseaseAssoc, this.sort)
        this.termTitle = "(" + this.term.id + ")" + " " + this.term.name;
      }, (error) => {
        console.log(error);
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




