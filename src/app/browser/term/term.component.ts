import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Term } from './term';
import { TermService } from '../services/term/term.service';
@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})
export class TermComponent implements OnInit {
  termTitle: string;
  query: string;
  term: Term;
  constructor(private route: ActivatedRoute, private termService: TermService) { 
    this.route.params.subscribe( params => this.query = params.id);
  }

  ngOnInit() {
    this.termService.searchTerm(this.query)
      .then((data) => {
        this.term = data.term[0];
        this.termTitle = "(" + this.term.id + ")" + " " + this.term.name;
      }, (error) => {
        console.log(error);
    });
  }

}
