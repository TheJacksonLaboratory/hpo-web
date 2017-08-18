import { Component, OnInit } from '@angular/core';
import { Phenotype } from '../Phenotypes';

@Component({
  selector: 'searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {
  query:String;
  filteredList:Array<Phenotype>;
  pheno:Array<Phenotype>;
  constructor() { 
    this.pheno = [ {"id":"HP:0012108","phenotype":"Open angle glaucoma","diseases":["GLAUCOMA 1, OPEN ANGLE, M","GLAUCOMA 1, OPEN ANGLE, G","GLAUCOMA 1, OPEN ANGLE, O"]},
                   {"id":"HP:0100019","phenotype":"Cortical cataract","diseases":["Cortical cataract","Cortical cataract"]}];
  }

  ngOnInit() {
  }
  filter(){
    if(this.query != ""){
      this.filteredList = this.pheno.filter(function(item){
        return item.phenotype.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
      }.bind(this));
    }else{
      this.filteredList = [];
    }
  }


select(item){
  this.query = item;
  this.filteredList = [];
}

}