import {Component, OnInit} from '@angular/core';
import {TeamMember} from "../../../browser/models/models";
import {TeamService} from "../../../shared/team/team.service";

@Component({
  selector: 'app-contributors',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  contributorsSource: TeamMember[];
  displayedColumns = ['lastName', 'firstName', 'location'];

  constructor(private contribService: TeamService) {
  }

  ngOnInit() {

    this.contribService.getContributors().subscribe((contribArray) => {
      this.contributorsSource = contribArray;
    });
  }
}
