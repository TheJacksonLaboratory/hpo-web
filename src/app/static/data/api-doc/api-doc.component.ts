import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-api-doc',
  templateUrl: './api-doc.component.html',
  styleUrls: ['./api-doc.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ApiDocComponent implements OnInit {

  constructor(http: HttpClient) { }

  ngOnInit(): void {
  }



}
