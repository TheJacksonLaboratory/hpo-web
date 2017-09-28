import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Phenotype } from '../Phenotypes';
import { TermService } from '../../services/term-service';

@Component({
  selector: 'searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {

  @Output() public searchActive = new EventEmitter<boolean>();
  public query: string;
  public terms: Phenotype[];
  constructor(private termService: TermService) {
    this.terms = [];
  }
  ngOnInit() {
    //this.getPhenotypes();
  }
  queryHPO(query: string): void {
    this.termService.searchTerms('http://localhost:8080/hpoSearch?q=' + this.query)
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
