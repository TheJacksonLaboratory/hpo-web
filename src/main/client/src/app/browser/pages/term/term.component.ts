import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { forkJoin as observableForkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TermService } from '../../services/term/term.service';
import { Term, Gene, Disease, TermTree, LoincEntry } from '../../models/models';
import { DialogService } from '../../../shared/dialog-excel-download/dialog.service';

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
    'isObsolete': true, 'xrefs': [], 'pubmedXrefs': [], 'purl': ''};
  geneColumns = ['entrezGeneId', 'dbDiseases'];
  geneSource: MatTableDataSource<Gene>;
  geneAssocCount: number;
  geneAssocMax: number;
  geneAssocOffset: number;
  geneDisplayCount: number;

  diseaseColumns = ['diseaseId', 'diseaseName', 'dbGenes'];
  diseaseAssocCount: number;
  diseaseAssocMax: number;
  diseaseAssocOffset: number;
  diseaseDisplayCount: number;
  diseaseSource: MatTableDataSource<Disease>;

  loincSource: MatTableDataSource<LoincEntry>;
  loincColumns = ['id', 'longName'];
  loincDisplayCount: number;

  treeData: TermTree;
  termTreeMainWidth: number;

  assocLoading = true;
  overlay = false;
  displayAllDiseaseAssc = false;
  displayAllGeneAssc = false;

  @ViewChild('diseasePaginator', { static: true }) diseasePaginator: MatPaginator;
  @ViewChild('genePaginator', { static: true }) genePaginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private route: ActivatedRoute, private termService: TermService, private dialogService: DialogService,
              private router: Router) {
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
      const loincService = this.termService.searchLoincByTerm(id);
      return observableForkJoin([geneService, diseaseService, loincService]);
    })).subscribe(([res1, res2, res3]) => {

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
      this.loincSource = new MatTableDataSource(res3.loincEntries);
      this.loincSource.sort = this.sort;
      this.loincDisplayCount = res3.loincEntries.length;
    }, err => {
      // TODO: Implement Better Handling Here
      const errorString = 'Could not find requested ' + this.paramId + '.';
      this.router.navigate(['/error'], {
        state: {
          description: errorString
        }});
      console.log(err);
    });
  }

  refreshData(query: string) {
    this.termService.searchTerm(query)
      .subscribe((data) => {
        this.setDefaults(data.details);
        const maxTermWidth = 100;
        this.treeData = data.relations;
        this.treeData.maxTermWidth = maxTermWidth;
        const termCount = this.treeData.termCount;
        this.treeData.children.sort((a, b) => a.childrenCount > b.childrenCount ? (-1) : 1);
        this.treeData.children.map(term => {
          const percent = term.childrenCount / termCount;
          const newWidth =  Math.ceil(maxTermWidth * percent);
          const newMargin = -115 + ((maxTermWidth - newWidth)  - 5) ;
          term.treeCountWidth = newWidth;
          term.treeMargin = newMargin;
        });
        this.termTitle = this.term.name;
      }, (error) => {
        // Error bubbles up
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
    if (term) {
      this.term = term;
      this.term.comment = (term.comment != null) ? term.comment : '';
      this.term.synonyms = (term.synonyms.length !== 0) ? term.synonyms : ['No synonyms found for this term.'];
      this.term.definition = (term.definition != null) ? term.definition : 'Sorry this term has no definition.';
      this.term.purl = 'http://purl.obolibrary.org/obo/' + term.id.replace(':', '_');
      this.term.xrefs = (term.xrefs != null) ? term.xrefs : [];
      this.term.pubmedXrefs = (term.pubmedXrefs != null) ? term.pubmedXrefs.map(pmid => {
          return {whole: pmid, id: pmid.split(':')[1]};
        }) : [];
    }
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

  downloadDialog() {
    const counts = {
      genes: this.geneAssocCount,
      diseases: this.diseaseAssocCount
    };
    this.dialogService.openDownloadDialog(this.term.id, 'term', counts);
  }

  setTreeStyles(child: Term): any {
    return {'width': child.treeCountWidth + 'px', 'margin-left': child.treeMargin + 'px', 'margin-right': '20px'};
  }
}




