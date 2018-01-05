import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Term, Gene, Disease } from '../../models/models';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'searchbar',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output() public searchActive = new EventEmitter<boolean>();
  query: string;
  terms: Term[];
  diseases: Disease[];
  genes: Gene[];
  bootCols: number;
  isLoading: boolean = false;
  constructor(private searchService: SearchService) {
    this.terms = [];
    this.diseases = [];
    this.genes = [];
    this.bootCols = 4;
  }
  ngOnInit() {
    //this.getPhenotypes();
  }
  queryHPO(query: string): void {
    this.isLoading = true;
    this.searchService.searchAll(this.query)
      .then((data) => {
        let numResults: number;
        this.terms = data.terms;
        this.diseases = data.diseases;
        this.genes = data.genes;
        numResults = this.checkEmpty(this.terms) + this.checkEmpty(this.diseases) + this.checkEmpty(this.genes)
        if(numResults == 2 ){
          this.bootCols = 6;
        }else if(numResults == 1){
          this.bootCols = 12;
        }
        this.isLoading = false;
      }, (error) => {
        console.log(error);
    });
  }

  filter() {
    if (this.query !== '' && this.query.length >= 3) {
      this.searchActive.emit(true);
      this.queryHPO(this.query);
    }else {
      this.terms = [];
      this.diseases = [];
      this.genes = [];
      this.bootCols = 4;
      this.searchActive.emit(false);
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
  /* Keep this when having search always around becomes necessary
    select(item) {
      this.query = item.name;
      this.terms = [];
    }
  */

}
