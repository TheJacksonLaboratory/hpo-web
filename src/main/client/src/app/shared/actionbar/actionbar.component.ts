import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-actionbar',
  templateUrl: './actionbar.component.html',
  styleUrls: ['./actionbar.component.css']
})
export class ActionbarComponent implements OnInit {

  //Expect Input of {'buttonName': <name>, 'routerLink': <link>}
  @Input() actions: Array<String>;

  constructor() {
    debugger;
  }

  ngOnInit() {

  }

}
