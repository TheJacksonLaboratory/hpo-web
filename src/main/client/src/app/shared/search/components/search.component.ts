import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Term, Gene, Disease } from '../../../browse/models/models';
import { SearchService } from '../service/search.service';

@Component({
  selector: 'searchoutput',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchOutputComponent implements OnInit {

  @Input() set searchString(query: string){
    if(query) {
      this.query = query;
      this.engageSearch()
    }
  };
  query: string;
  terms: Term[];
  diseases: Disease[];
  genes: Gene[];
  bootCols: number;
  isLoading: boolean = false;
  notFound: boolean = false;
  constructor(private searchService: SearchService) {
    this.terms = [];
    this.diseases = [];
    this.genes = [];
    this.bootCols = 4;
  }
  ngOnInit() {

  }

  queryHPO(query: string): void {
    this.isLoading = true;
    this.notFound = false;
    this.searchService.searchAll(this.query)
      .subscribe((data) => {
        let numResults: number;
        this.terms = data.terms;
        this.diseases = data.diseases;
        this.genes = data.genes;
        numResults = this.checkEmpty(this.terms) + this.checkEmpty(this.diseases) + this.checkEmpty(this.genes);
        if(numResults == 2 ){
          this.bootCols = 6;
        }else if(numResults == 1){
          this.bootCols = 12;
        }else if(numResults != 1 && numResults !=2 && numResults != 3){
          this.notFound = true;
        }
        this.isLoading = false;
      }, (error) => {
        // TODO: Implement Better Error Handling
        console.log(error);
    });
  }

  engageSearch() {
    debugger;
    if (this.query !== '' && this.query.length >= 3) {
      this.queryHPO(this.query);
    }else {
      this.terms = [];
      this.diseases = [];
      this.genes = [];
      this.bootCols = 4;
    }
  }

  checkEmpty(array: Array<any>): number {
    if(array.length != 0){
      return 1;
    }
    else{
      return 0;
    }
  }

}
