import { Component, OnInit } from '@angular/core';
import { Contributors } from "../../../browse/models/models";
import {ContributorsService} from "../../../shared/contributors/contributors.service";

@Component({
  selector: 'app-contributors',
  templateUrl: './contributors.component.html',
  styleUrls: ['./contributors.component.css']
})
export class ContributorsComponent implements OnInit {

  contributorsSource: Contributors[];
  displayedColumns = ['firstName', 'lastName', 'location'];
  constructor(private contribService: ContributorsService) { }

  ngOnInit() {

    this.contribService.getContributors().subscribe((contribArray) => {
      this.contributorsSource = contribArray;
    });
  }
}
