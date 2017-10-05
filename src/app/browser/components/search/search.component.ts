import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Term } from '../term/term';
import { Disease } from '../disease/disease';
import { Gene } from '../gene/gene'
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
    this.searchService.searchAll(this.query)
      .then((data) => {
        this.terms = data.terms;
        this.diseases = data.diseases;
        if(this.terms && this.diseases){
          this.bootCols = 6;
        }
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
  /* Keep this when having search always around becomes necessary
    select(item) {
      this.query = item.name;
      this.terms = [];
    }
  */

}
