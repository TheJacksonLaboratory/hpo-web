import { Component, OnInit } from '@angular/core';
import { UtilityService } from "../../shared/utility/utility.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  constructor(public utilityService: UtilityService) { }

}
