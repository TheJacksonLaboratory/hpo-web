import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from 'primeng/card';
import { HighlightPipe } from '../../../../shared/pipes/highlight.pipe';

export interface SearchResultItem {
  category: 'term' | 'disease' | 'gene';
  id: string;
  routerLink: string;
  title: string;
  subtitle: string;
  matchingString: string;
  description: string;
}

@Component({
  selector: 'app-search-result-card',
  standalone: true,
  imports: [RouterLink, Card, HighlightPipe],
  templateUrl: './search-result-card.component.html',
})
export class SearchResultCardComponent {
  @Input({ required: true }) item: SearchResultItem;
  @Input() query = '';
}
