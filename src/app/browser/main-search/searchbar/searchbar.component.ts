import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Phenotype } from '../Phenotypes';
import { PhenotypeService } from '../../services/phenotype-service';

@Component({
  selector: 'searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {

  @Output() searchActive = new EventEmitter<boolean>();
  query: String;
  filteredList: Phenotype[];
  pheno: Phenotype[];
  constructor(private phenoService: PhenotypeService) {
    this.pheno = [];
  }
  ngOnInit() {
    this.getPhenotypes();
  }
  getPhenotypes(): void {
    this.phenoService.searchPhenotypes('http://localhost:9999/phenotypes')
        .then((phenotypes) => {
          this.pheno[0] = phenotypes;
        }, (error) => {
            console.log(error);
        });
  }

  filter() {
    if (this.query !== '') {
      this.searchActive.emit(true);
      this.filteredList = this.pheno.filter(function(item){
        return item.phenotype.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
      }.bind(this));
    }else {
      this.filteredList = [];
      this.searchActive.emit(false);
    }
  }
  
  select(item) {
    this.query = item.phenotype;
    this.filteredList = [];
  }

}
