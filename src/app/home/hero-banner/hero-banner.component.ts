import { Component, computed, input } from '@angular/core';
import { SearchFormComponent } from '../../shared/search/search-form/search-form.component';

const DEFAULT_GRADIENT =
  'linear-gradient(108.5deg, #0E3272 12.7%, #245F9E 72.2%, #3684C3 94.8%)';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [SearchFormComponent],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.scss',
})
export class HeroBannerComponent {
  gradient = input<string>(DEFAULT_GRADIENT);
  gradientStyle = computed(() => this.gradient());
}
