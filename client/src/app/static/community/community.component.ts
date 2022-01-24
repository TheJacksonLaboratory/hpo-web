import {Component, OnInit, ViewChild} from '@angular/core';
import {IndividualContributer, Organization} from '../../browser/models/models';
import {TeamService} from '../../shared/team/team.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {UtilityService} from '../../shared/utility.service';


@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {

  organizations: Organization[];
  contributorsSource: MatTableDataSource<IndividualContributer>;
  displayedColumns = ['lastName', 'firstName', 'location'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private teamService: TeamService, private utilityService: UtilityService) {}

  ngOnInit(): void {
    this.teamService.getTeamOrganizations().subscribe((teamOrganizations) => {
      this.organizations = teamOrganizations;
    });

    this.teamService.getContributors().subscribe((contribArray) => {
      this.contributorsSource = new MatTableDataSource<IndividualContributer>(contribArray);
      this.contributorsSource.paginator = this.paginator;
    });
  }

  scrollToView(id: string) {
    const el = document.getElementById(id.toLowerCase());
    el.scrollIntoView({behavior: 'smooth'});
  }

  navigate(member) {
    if (!member.alumni) {
      this.utilityService.openExternalUrl(member.link);
    }
  }

}
