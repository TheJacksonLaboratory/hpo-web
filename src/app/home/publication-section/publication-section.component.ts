import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-publication-section',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './publication-section.component.html',
  styleUrl: './publication-section.component.scss',
})
export class PublicationSectionComponent {
  openPaper(): void {
    window.open('https://academic.oup.com/nar/article/52/D1/D1333/7416384', '_blank');
  }
}
