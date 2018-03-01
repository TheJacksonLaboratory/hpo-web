import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Term, Gene, Disease } from '../../../browse/models/models';
import { SearchService } from '../service/search.service';

@Component({
  selector: 'searchoutput',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchOutputComponent implements OnInit {

  @Output() public searchActive = new EventEmitter<boolean>();
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
    this.searchService.searchAll(this.query)
      .subscribe((data) => {
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
        // TODO: Implement Better Error Handling
        console.log(error);
    });
  }

  engageSearch() {
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

}
