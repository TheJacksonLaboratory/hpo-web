import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';


@Component({
  selector: 'app-documentation',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {
  pageTitle: String;
  pageIntro: String;
  constructor() {

  }

  ngOnInit() {

  }
  ngOnDestroy(){
  }

}
