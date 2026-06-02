import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { PublicationsService } from '../../static/resources/publications/publications.service';
import { Publication } from '../../browser/models/models';

@Component({
  selector: 'app-publication-section',
  standalone: true,
  imports: [RouterLink, Card, Button],
  templateUrl: './publication-section.component.html',
  styleUrl: './publication-section.component.scss',
})
export class PublicationSectionComponent implements OnInit {
  mostRecentPublication: Publication | null = null;

  constructor(private pubService: PublicationsService) {}

  ngOnInit(): void {
    this.pubService.getPublications().subscribe(publications => {
      this.mostRecentPublication = publications[0] ?? null;
    });
  }
}
