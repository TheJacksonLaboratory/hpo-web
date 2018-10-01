import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {Term, Gene, Disease} from "../../models/models";
import {SearchService} from "../../../shared/search/service/search.service";
import {ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  query: string;
  terms: Term[] = [];
  diseases: Disease[] = [];
  genes: Gene[] = [];
  isLoading: boolean = true;
  navFilter : string = 'term';
  selectedTab : number = 0;

  termDisplayedColumns = ['ontologyId', 'name', 'childrenCount'];
  termDataSource : MatTableDataSource<Term>;

  diseaseDisplayedColumns = ['diseaseId', 'dbName'];
  diseaseDataSource : MatTableDataSource<Disease>;

  geneDisplayedColumns = ['entrezGeneId', 'entrezGeneSymbol'];
  geneDataSource : MatTableDataSource<Gene>;

  @ViewChild('termPaginator') termPaginator: MatPaginator;
  @ViewChild('diseasePaginator') diseasePaginator: MatPaginator;
  @ViewChild('genePaginator') genePaginator: MatPaginator;


  constructor(private route: ActivatedRoute, private searchService: SearchService ) {
    this.route.queryParams.subscribe((params) => {
      this.query = params['q'];
      this.navFilter = params['navFilter'];

      this.reloadResultsData();
      this.setSelectedTab();
    });
  }

  ngOnInit() {
  }

  setSelectedTab(){

    if (this.navFilter ==  'disease'){
      this.selectedTab = 1;
    }else if (this.navFilter == 'gene'){
      this.selectedTab = 2;
    }else if (this.navFilter == 'term' || this.navFilter == 'all'){
      this.selectedTab = 0;
    }
  }
  reloadResultsData(){
    this.isLoading = true;
    this.searchService.searchFetchAll(this.query).subscribe((data) => {
      this.terms = data.terms;
      this.diseases = data.diseases;
      this.genes = data.genes;

      this.termDataSource = new MatTableDataSource(this.terms);
      this.diseaseDataSource = new MatTableDataSource(this.diseases);
      this.geneDataSource = new MatTableDataSource(this.genes);

      this.termDataSource.paginator = this.termPaginator;
      this.diseaseDataSource.paginator = this.diseasePaginator;
      this.geneDataSource.paginator = this.genePaginator;

      this.isLoading = false;

    }, (error) => {
      // TODO: Implement Better Error Handling
      console.log(error);
    });
  }

  applyTermFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.termDataSource.filter = filterValue;
  }

  applyDiseaseFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.diseaseDataSource.filter = filterValue;
  }

  applyGeneFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.geneDataSource.filter = filterValue;
  }

}
