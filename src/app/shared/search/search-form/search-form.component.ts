import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [FormsModule, InputText, Button],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
})
export class SearchFormComponent {
  searchQuery = '';
  readonly popularSearches = ['Long Fingers', 'FBN1', 'Marfan Syndrome'];

  private router = inject(Router);

  submitSearch(query: string): void {
    const trimmed = query.trim();
    if (!trimmed) return;
    this.router.navigate(['/browse/search'], {
      queryParams: { q: trimmed, navFilter: 'all' },
    });
  }

}
