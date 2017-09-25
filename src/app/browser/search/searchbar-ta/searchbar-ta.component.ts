import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Phenotype } from '../Phenotypes';
import { PhenotypeService } from '../../services/phenotype-service';

@Component({
  selector: 'searchbar',
  templateUrl: './searchbar-ta.component.html',
  styleUrls: ['./searchbar-ta.component.css']
})
export class SearchbarTAComponent implements OnInit {

  @Output() public searchActive = new EventEmitter<boolean>();
  public query: string;
  public terms: Phenotype[];
  constructor(private phenoService: PhenotypeService) {
    this.terms = [];
  }
  ngOnInit() {
    //this.getPhenotypes();
  }
  queryHPO(query: string): void {
    this.phenoService.searchPhenotypes('http://localhost:8080/hpoSearch?q=' + this.query)
      .then((data) => {
        this.terms = data.results;
      }, (error) => {
        console.log(error);
    });
  }

  filter() {
    if (this.query !== '' && this.query.length >= 3) {
      this.searchActive.emit(true);
      this.queryHPO(this.query);
      /*this.filteredList = this.terms.filter(function(item){
        return item.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
      }.bind(this));*/
    }else {
      this.terms = [];
      this.searchActive.emit(false);
    }
  }
  select(item) {
    this.query = item.name;
    this.terms = [];
  }

}
