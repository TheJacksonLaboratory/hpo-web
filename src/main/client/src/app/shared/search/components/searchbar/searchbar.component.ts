import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {
  @Output() queryEmit: EventEmitter<string> = new EventEmitter<string>();
  @Input() set resetQuery(reset:boolean){
    if(reset){
      this.query = "";
      this.emitQuery(new Event("reset"))
    }
  };
  query: string;
  constructor() { }

  ngOnInit() {
  }
  emitQuery(event): void {
    this.queryEmit.emit(
        this.query
      );
  }

  setQuery(term: string): void {
    this.query = term;
    this.emitQuery(new Event("activate"))
  }
}
