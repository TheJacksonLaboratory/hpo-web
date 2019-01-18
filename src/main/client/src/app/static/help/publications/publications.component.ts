import { Component, OnInit } from '@angular/core';
import { PublicationsService } from './publications.service';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css']
})
export class PublicationsComponent implements OnInit {

  constructor(private pubService: PublicationsService) { }

  ngOnInit() {
    this.pubService.getPublications().subscribe(publications => {
      // Do some stuff with the publications
    });
  }

}
