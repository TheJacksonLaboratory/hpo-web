import { Component, ViewChild } from '@angular/core';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {Term, Gene, Disease} from '../../models/models';
import {SearchService} from '../../../shared/search/service/search.service';
import {ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {

  query: string;
  terms: Term[] = [];
  diseases: Disease[] = [];
  genes: Gene[] = [];
  isLoading = true;
  navFilter = 'term';
  selectedTab = 0;
  counts = {term: 0, disease: 0, gene: 0};

  termDisplayedColumns = ['ontologyId', 'name', 'matching_string', 'childrenCount'];
  termDataSource: MatTableDataSource<Term>;

  diseaseDisplayedColumns = ['diseaseId', 'dbName', 'matching_string'];
  diseaseDataSource: MatTableDataSource<Disease>;

  geneDisplayedColumns = ['entrezGeneId', 'entrezGeneSymbol', 'matching_string'];
  geneDataSource: MatTableDataSource<Gene>;

  @ViewChild('termPaginator', { static: true }) termPaginator: MatPaginator;
  @ViewChild('diseasePaginator', { static: true }) diseasePaginator: MatPaginator;
  @ViewChild('genePaginator', { static: true }) genePaginator: MatPaginator;


  constructor(private route: ActivatedRoute, private searchService: SearchService ) {
    this.route.queryParams.subscribe((params) => {
      this.query = params['q'];
      this.navFilter = params['navFilter'];

      this.reloadResultsData();
    });
  }

  setSelectedTab() {
    // Filter should have precedence
    // then if the filter is as is default to the most counts
    if (this.navFilter === 'all') {
      const maxTab = Object.keys(this.counts).reduce((a, b) => this.counts[a] > this.counts[b] ? a : b);
      this.determineTab(maxTab);
    } else {
      this.determineTab(this.navFilter);
    }
  }

  determineTab(filterItem: string) {
    if (filterItem ===  'disease') {
      this.selectedTab = 1;
    } else if (filterItem === 'gene') {
      this.selectedTab = 2;
    } else if (filterItem === 'term') {
      this.selectedTab = 0;
    }
  }

  reloadResultsData() {
    this.isLoading = true;
    this.searchService.searchFetchAll(this.query).subscribe((data) => {
      this.terms = this.termMatchingStringBuilder(data.terms);
      this.diseases = this.diseaseMatchingStringBuilder(data.diseases);
      this.genes = this.genesMatchingStringBuilder(data.genes);

      this.counts['term'] = data.termsTotalCount;
      this.counts['disease'] = data.diseasesTotalCount;
      this.counts['gene'] = data.genesTotalCount;

      this.termDataSource = new MatTableDataSource(this.terms);
      this.diseaseDataSource = new MatTableDataSource(this.diseases);
      this.geneDataSource = new MatTableDataSource(this.genes);

      this.termDataSource.paginator = this.termPaginator;
      this.diseaseDataSource.paginator = this.diseasePaginator;
      this.geneDataSource.paginator = this.genePaginator;

      this.isLoading = false;
      this.setSelectedTab();

    }, (error) => {
      // TODO: Implement Better Error Handling
      console.log(error);
    });
  }

  // Method to convert a matching string column.
  // If synonym exists, it's the matching string apply
  // the highlight pipe. Otherwise the term is the matching string.
  // This is needed for the way tables are built with angular material
  termMatchingStringBuilder(terms) {
    terms.map( term => {
      if (term.synonym != null) {
        term['matchingString'] = term.synonym;
      } else {
        term['matchingString'] = term.name;
      }
    });
    return terms;
  }

  diseaseMatchingStringBuilder(diseases) {
    diseases.map( disease => {
      if (disease.dbName) {
        disease['matchingString'] = disease.dbName;
      }
    });
    return diseases;
  }

  genesMatchingStringBuilder(genes) {
    genes.map( gene => {
      if (gene.entrezGeneSymbol) {
          gene['matchingString'] = gene.entrezGeneSymbol;
        }
      });
    return genes;
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
