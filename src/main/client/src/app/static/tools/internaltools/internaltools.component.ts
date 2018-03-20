import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-internaltools',
  templateUrl: './internaltools.component.html',
  styleUrls: ['./internaltools.component.css']
})
export class InternalToolsComponent implements OnInit {
  pageTitle: string = "Tools / Internal";
  constructor() { }

  ngOnInit() {
  }

}
