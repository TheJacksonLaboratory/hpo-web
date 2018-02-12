import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params} from '@angular/router';
import { MatSort } from '@angular/material';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/forkJoin';
import { Observable } from "rxjs/Observable";
// Models
import { Term, TermTree} from '../../models/models';
import { DiseaseAssocDB,GeneAssocDB } from '../../models/associations/datasources/associations-db';
import { GeneAssocDatasource } from '../../models/associations/datasources/gene-assoc-datasource';
import { DiseaseAssocDatasource } from '../../models/associations/datasources/disease-assoc-datasource';
// Services
import { TermService } from '../../services/term/term.service';


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
  assocLoading: boolean = true;
  overlay: boolean = false;
  toolTipPosition: "above";

  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute, private termService: TermService) {
  }

  ngOnInit() {
    this.route.params.switchMap((params: Params) => {
      this.assocLoading = true;
      this.overlay = false;
      this.refreshData(params.id);
      let geneService = this.termService.searchGenesByTerm(params.id);
      let diseaseService = this.termService.searchDiseasesByTerm(params.id);
      return Observable.forkJoin(geneService, diseaseService)
    }).subscribe(([res1,res2]) => {
      this.geneAssoc = new GeneAssocDB(res1.genes);
      this.geneSource = new GeneAssocDatasource(this.geneAssoc, this.sort);
      this.diseaseAssoc = new DiseaseAssocDB(res2.diseases);
      this.diseaseSource = new DiseaseAssocDatasource(this.diseaseAssoc, this.sort);
      this.assocLoading = false;
    }, err=>{
      // TODO: Implement Better Handling Here
      console.log(err);
    });
  }

  refreshData(query: string){
    this.termService.searchTerm(query)
      .subscribe((data) => {
        this.setDefaults(data.details);
        this.treeData = data.relations;
        this.termTitle = "(" + this.term.id + ")" + " " + this.term.name;
      }, (error) => {
        // TODO:Implement Better Handling Here
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
  showOverlay(){
    this.overlay = true;
  }
  removeOverlay(event){
    if(event.target.classList.contains("search-overlay")){
      this.overlay = false;
    }
  }
  onEscKey(event){
    if(event.key == "Escape"){
      this.overlay = false;
    }
  }
}




