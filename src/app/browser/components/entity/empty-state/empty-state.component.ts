import { Component, Input } from '@angular/core';

/**
 * Placeholder shown in a section that has no rows: an invitation to contribute
 * the missing data, pointing at whatever channel that entity type is curated
 * through.
 *
 * Deliberately carries no "nothing found" copy - the section heading already
 * reports the count, and the design shows only the call to action.
 *
 * Only for sections that genuinely can be empty for a given entity. Data an
 * entity type never has is omitted from its section config instead, so no page
 * shows a permanent empty state - see
 * `docs/adr/0001-HPO-68-unified-entity-page.md`.
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [],
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  /** Call-to-action text. Rendered only alongside a {@link ctaHref}. */
  @Input() ctaLabel = 'Interested in Contributing? Get Started';

  /**
   * Where the call to action points. Set per association type by the caller,
   * since each is curated through a different channel.
   */
  @Input() ctaHref?: string;
}
