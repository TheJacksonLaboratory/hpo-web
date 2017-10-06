import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Term } from './term';
import { TermService } from '../../services/term/term.service';
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
    this.term = {"id":"", "name": "", "definition":"", "altTermIds": [], "comment":"", "synonyms": [], "isObsolete": true, "xrefs": [], "purl": ""};
  }

  ngOnInit() {
    this.termService.searchTerm(this.query)
      .then((data) => {
        this.setDefaults(data.term);
        this.termTitle = "(" + this.term.id + ")" + " " + this.term.name;
      }, (error) => {
        console.log(error);
    });
  }

  setDefaults(term: Term){
    this.term = term;
    console.log(this.term);
    this.term.altTermIds = (term.altTermIds.length != 0) ? term.altTermIds: ["-"];
    this.term.definition = (term.definition != null) ? term.definition: "Sorry this term has no definition.";
    this.term.purl = "http://purl.obolibrary.org/obo/" + term.id.replace(":","_");
  }

}
