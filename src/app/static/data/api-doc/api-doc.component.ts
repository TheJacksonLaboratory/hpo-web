import { Component, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-api-doc',
    imports: [MatCardModule, MatButtonModule],
    templateUrl: './api-doc.component.html',
    styleUrls: ['./api-doc.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ApiDocComponent {

  constructor() { }
}
