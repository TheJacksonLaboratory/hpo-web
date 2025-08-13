import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Disease, Gene, Term } from '../../models/models';
import { SearchService } from '../../../shared/search/service/search.service';
import { ActivatedRoute } from '@angular/router';

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

  termDisplayedColumns = ['ontologyId', 'name', 'matching_string', 'synonym_match'];
  termDataSource

  diseaseDisplayedColumns = ['diseaseId', 'dbName', 'matching_string'];
  diseaseDataSource;

  geneDisplayedColumns = ['entrezGeneId', 'entrezGeneSymbol', 'matching_string'];
  geneDataSource: MatTableDataSource<Gene>;

  @ViewChild('termPaginator', { static: true }) termPaginator: MatPaginator;
  @ViewChild('diseasePaginator', { static: true }) diseasePaginator: MatPaginator;
  @ViewChild('genePaginator', { static: true }) genePaginator: MatPaginator;


  constructor(private route: ActivatedRoute, private searchService: SearchService) {
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
      const counts = { 'term': this.termDataSource.data.length, 'gene': this.geneDataSource.data.length, 'disease': this.diseaseDataSource.data.length };
      const maxTab = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      this.determineTab(maxTab);
    } else {
      this.determineTab(this.navFilter);
    }
  }

  determineTab(filterItem: string) {
    if (filterItem === 'disease') {
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
      this.terms = this.termMatchingStringBuilder(this.query, data.terms);
      this.diseases = this.responseMatchingStringBuilder(data.diseases);
      this.genes = this.responseMatchingStringBuilder(data.genes);

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
  termMatchingStringBuilder(query, termResponse) {
    termResponse.terms.map(term => {
      term.synonyms.map(syn => {
        if (syn.toLowerCase().includes(query.toLowerCase())){
          term['matchingString'] = syn;
          return;
        }
      });
      if (term['matchingString'] === null) {
        term['matchingString'] = term.name;
      }
    });
    return termResponse.terms;
  }

  responseMatchingStringBuilder(response) {
    response.results.map(result => {
      if (result.name) {
        result['matchingString'] = result.name;
      }
    });
    return response.results;
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
