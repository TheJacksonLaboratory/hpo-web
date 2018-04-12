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
  geneAssocCount: number;
  geneAssocMax: number;
  geneAssocOffset: number;
  geneDisplayCount : number;
  diseaseAssoc: DiseaseAssocDB;
  diseaseAssocCount: number;
  diseaseAssocMax: number;
  diseaseAssocOffset: number;
  diseaseDisplayCount : number;
  geneSource: GeneAssocDatasource | null;
  diseaseSource: DiseaseAssocDatasource | null;
  treeData: TermTree;
  assocLoading: boolean = true;
  overlay: boolean = false;
  toolTipPosition: "above";
  displayAllDiseaseAssc = false;
  displayAllGeneAssc = false;

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
      this.geneAssocCount = res1.geneCount;
      this.geneAssocMax = res1.max;
      this.geneAssocOffset = res1.offset;
      this.geneDisplayCount = (res1.geneCount < res1.max)? res1.geneCount : res1.max;
      this.displayAllGeneAssc = false;

      this.diseaseAssoc = new DiseaseAssocDB(res2.diseases);
      this.diseaseAssocCount = res2.diseaseCount
      this.diseaseAssocMax = res2.max;
      this.diseaseAssocOffset = res2.offset;
      this.diseaseDisplayCount = (res2.diseaseCount < res2.max)? res2.diseaseCount : res2.max;
      this.diseaseSource = new DiseaseAssocDatasource(this.diseaseAssoc, this.sort);
      this.assocLoading = false;
      this.displayAllDiseaseAssc = false;

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
        this.termTitle = this.term.name;
      }, (error) => {
        // TODO:Implement Better Handling Here
        console.log(error);
    });
  }

  reloadDiseaseAssociations(offset : string, max: string){
    this.termService.searchDiseasesByTerm(this.term.id, offset, max)
      .subscribe((data) => {
        let newDiseaseAssoc = new DiseaseAssocDB(data.diseases);
        this.diseaseSource = new DiseaseAssocDatasource(newDiseaseAssoc, this.sort);
        this.diseaseAssocCount = data.diseaseCount;
        this.diseaseAssocOffset = data.offset;
        this.diseaseAssocMax = data.max;
        this.diseaseDisplayCount = data.diseaseCount;
        this.displayAllDiseaseAssc = true;
        this.assocLoading = false;
      })
  }

  reloadGeneAssociations(offset : string, max: string){
    this.termService.searchGenesByTerm(this.term.id, offset, max)
      .subscribe((data) => {
        let newGeneAssoc = new GeneAssocDB(data.genes);
        this.geneSource = new GeneAssocDatasource(newGeneAssoc, this.sort);
        this.geneAssocCount = data.geneCount;
        this.geneAssocOffset = data.offset;
        this.geneAssocMax = data.max;
        this.geneDisplayCount = data.geneCount;
        this.displayAllGeneAssc = true;
        this.assocLoading = false;
      })
  }

  setDefaults(term: Term){
    this.term = term;
    this.term.synonyms = (term.synonyms.length != 0) ? term.synonyms: ["No synonyms found for this term."];
    this.term.definition = (term.definition != null) ? term.definition: "Sorry this term has no definition.";
    this.term.purl = "http://purl.obolibrary.org/obo/" + term.id.replace(":","_");
  }

  showAllDiseases(event){
    this.assocLoading = true;
    this.reloadDiseaseAssociations('0', '-1')
  }

  showAllGenes(event){
    this.assocLoading = true;
    this.reloadGeneAssociations('0', '-1')
  }

  copyToClipboard(text){
    let txtArea = document.createElement("textarea");
    txtArea.style.position = 'fixed';
    txtArea.style.top = '0';
    txtArea.style.left = '0';
    txtArea.style.opacity = '0';
    txtArea.value = text;
    document.body.appendChild(txtArea);
    txtArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(txtArea);
    } catch (err) {
      console.log('Unable to copy');
    }
    return false;

  }
}




