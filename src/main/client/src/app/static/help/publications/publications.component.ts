import { Component, OnInit } from '@angular/core';
import { PublicationsService } from './publications.service';
import { Publication } from '../../../browser/models/models';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss']
})
export class PublicationsComponent implements OnInit {

  publications: Publication[];
  constructor(private pubService: PublicationsService) { }
  displayedColumns: string[] = ['year', 'title', 'journal', 'authors'];

  ngOnInit() {
    this.pubService.getPublications().subscribe(publications => {
      this.publications = publications;
    });
  }

}
