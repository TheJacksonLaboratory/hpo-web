import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {
  @Output() queryEmit: EventEmitter<string> = new EventEmitter<string>();
  query: string;
  constructor() { }

  ngOnInit() {
  }
  emitQuery(event): void {
    let query = event.target.value;
    this.queryEmit.emit(
        query
      );
  }
}
