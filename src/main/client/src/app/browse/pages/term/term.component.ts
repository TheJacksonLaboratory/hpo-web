import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params} from '@angular/router';
import { MatSort } from '@angular/material';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { forkJoin as observableForkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TermService } from '../../services/term/term.service';
import { Term, Gene, Disease, TermTree} from '../../models/models';


@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})
export class TermComponent implements OnInit {
  termTitle: string;
  query: string;
  paramId: string;
  term: Term = {'id': '', 'name': '', 'definition': '', 'altTermIds': [], 'comment': '', 'synonyms': [],
    'isObsolete': true, 'xrefs': [], 'purl': ''};
  geneColumns = ['entrezGeneId', 'dbDiseases'];
  diseaseColumns = ['diseaseId', 'diseaseName', 'dbGenes'];
  geneAssocCount: number;
  geneAssocMax: number;
  geneAssocOffset: number;
  geneDisplayCount: number;
  diseaseAssocCount: number;
  diseaseAssocMax: number;
  diseaseAssocOffset: number;
  diseaseDisplayCount: number;
  geneSource: MatTableDataSource<Gene>;
  diseaseSource: MatTableDataSource<Disease>;
  treeData: TermTree;
  assocLoading = true;
  overlay = false;
  displayAllDiseaseAssc = false;
  displayAllGeneAssc = false;

  @ViewChild('diseasePaginator') diseasePaginator: MatPaginator;
  @ViewChild('genePaginator') genePaginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute, private termService: TermService) {
  }

  ngOnInit() {
    this.route.params.pipe(switchMap((params: Params) => {
      const id = params['id'];
      this.assocLoading = true;
      this.overlay = false;
      this.paramId = id;
      this.refreshData(id);
      const geneService = this.termService.searchGenesByTerm(id);
      const diseaseService = this.termService.searchDiseasesByTerm(id);
      return observableForkJoin(geneService, diseaseService);
    })).subscribe(([res1, res2]) => {

      this.geneSource = new MatTableDataSource(res1.genes);
      this.geneAssocCount = res1.geneCount;
      this.geneAssocMax = res1.max;
      this.geneAssocOffset = res1.offset;
      this.geneDisplayCount = (res1.geneCount < res1.max) ? res1.geneCount : res1.max;
      this.displayAllGeneAssc = false;

      this.diseaseSource = new MatTableDataSource(res2.diseases);
      this.diseaseAssocCount = res2.diseaseCount;
      this.diseaseAssocMax = res2.max;
      this.diseaseAssocOffset = res2.offset;
      this.diseaseDisplayCount = (res2.diseaseCount < res2.max) ? res2.diseaseCount : res2.max;
      this.assocLoading = false;
      this.displayAllDiseaseAssc = false;

    }, err => {
      // TODO: Implement Better Handling Here
      console.log(err);
    });
  }

  refreshData(query: string) {
    this.termService.searchTerm(query)
      .subscribe((data) => {
        this.setDefaults(data.details);
        this.treeData = data.relations;
        this.treeData.children.sort((a, b) => a.childrenCount > b.childrenCount ? (-1) : 1);
        this.termTitle = this.term.name;
      }, (error) => {
        // TODO:Implement Better Handling Here
        console.log(error);
    });
  }

  reloadDiseaseAssociations(offset: string, max: string) {
    this.termService.searchDiseasesByTerm(this.term.id, offset, max)
      .subscribe((data) => {

        this.diseaseSource = new MatTableDataSource(data.diseases);
        this.diseaseAssocCount = data.diseaseCount;
        this.diseaseAssocOffset = data.offset;
        this.diseaseAssocMax = data.max;
        this.diseaseDisplayCount = data.diseaseCount;
        this.displayAllDiseaseAssc = true;
        this.assocLoading = false;

        this.diseaseSource.paginator = this.diseasePaginator;

      });
  }

  reloadGeneAssociations(offset: string, max: string) {
    this.termService.searchGenesByTerm(this.term.id, offset, max)
      .subscribe((data) => {

        this.geneSource = new MatTableDataSource(data.genes);
        this.geneAssocCount = data.geneCount;
        this.geneAssocOffset = data.offset;
        this.geneAssocMax = data.max;
        this.geneDisplayCount = data.geneCount;
        this.displayAllGeneAssc = true;
        this.assocLoading = false;

        this.geneSource.paginator = this.genePaginator;
      });
  }

  setDefaults(term: Term) {
    this.term = term;
    this.term.comment = (term.comment != null) ? term.comment : '';
    this.term.synonyms = (term.synonyms.length !== 0) ? term.synonyms : ['No synonyms found for this term.'];
    this.term.definition = (term.definition != null) ? term.definition : 'Sorry this term has no definition.';
    this.term.purl = 'http://purl.obolibrary.org/obo/' + term.id.replace(':', '_');
    this.term.xrefs = (term.xrefs != null) ? term.xrefs : [];
  }

  showAllDiseases(event) {
    this.assocLoading = true;
    this.reloadDiseaseAssociations('0', '-1');
  }

  showAllGenes(event) {
    this.assocLoading = true;
    this.reloadGeneAssociations('0', '-1');
  }

  copyToClipboard(text) {
    const txtArea = document.createElement('textarea');
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

  applyDiseaseFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.diseaseSource.filter = filterValue;
  }

  applyGeneFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.geneSource.filter = filterValue;
  }
}




