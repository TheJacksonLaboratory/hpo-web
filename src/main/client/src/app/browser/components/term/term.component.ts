import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Term } from '../../models/models';
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
  term: Term;
  geneColumns = ['entrezGeneId','dbDiseases'];
  diseaseColumns = ['diseaseId', 'diseaseName', 'dbGenes']
  geneAssoc: GeneAssocDB;
  diseaseAssoc: DiseaseAssocDB;
  geneSource: GeneAssocDatasource | null;
  diseaseSource: DiseaseAssocDatasource | null;
  isLoading: boolean;


  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute, private termService: TermService) {
    this.isLoading = true;
    this.route.params.subscribe( params => this.query = params.id);
    this.term = {"id":"", "name": "", "definition":"", "altTermIds": [], "comment":"", "synonyms": [], "isObsolete": true, "xrefs": [], "purl": ""};
  }

  ngOnInit() {
    this.termService.searchTerm(this.query)
      .then((data) => {
        //debugger;
        this.setDefaults(data.term);
        this.geneAssoc = new GeneAssocDB(data.geneAssoc)
        this.geneSource = new GeneAssocDatasource(this.geneAssoc, this.sort);
        this.diseaseAssoc = new DiseaseAssocDB(data.diseaseAssoc)
        this.diseaseSource = new DiseaseAssocDatasource(this.diseaseAssoc, this.sort)
        this.termTitle = "(" + this.term.id + ")" + " " + this.term.name;
        this.isLoading = false;
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




