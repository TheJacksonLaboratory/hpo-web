import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clinician-guide',
  templateUrl: './clinician-guide.component.html',
  styleUrls: ['./clinician-guide.component.css']
})
export class ClinicianGuideComponent implements OnInit {
  pageTitle: String = "Help / Clinician Guide";
  pageIntro: String = "";
  constructor() { }

  ngOnInit() {
  }

}
