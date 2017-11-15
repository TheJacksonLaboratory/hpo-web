import { Component, OnInit } from '@angular/core';
import { Disease } from '../../models/models';
import { ActivatedRoute } from '@angular/router';
import { DiseaseService } from '../../services/disease/disease.service';
@Component({
  selector: 'app-disease',
  templateUrl: './disease.component.html',
  styleUrls: ['./disease.component.css']
})
export class DiseaseComponent implements OnInit {
  query: string;
  disease: Disease;
  constructor(private route: ActivatedRoute, private diseaseService: DiseaseService) { 
    this.route.params.subscribe( params => this.query = params.id);
    this.disease = {"db":"", "dbObjectId": "0", "dbName":"", "dbReference": ""};
  }

  ngOnInit() {
    this.diseaseService.searchDisease(this.query)
    .then((data)=>{
      this.disease  = data.disease[0];
    }, (error) => {
      console.log(error);
    });
  }
}
