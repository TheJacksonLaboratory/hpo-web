import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UtilityService } from "../../shared/utility/utility.service";

@Component({
    selector: 'app-about',
    imports: [RouterModule, MatButtonModule, MatIconModule],
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  constructor(public utilityService: UtilityService) { }

}
