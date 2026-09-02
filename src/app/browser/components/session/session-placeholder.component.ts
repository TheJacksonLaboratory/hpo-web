import { Component, Input } from '@angular/core';

/**
 * Placeholder for the "Session History" breadcrumb trail from Figma
 * (a real, separate component - HPO-43, folded into the HPO-66 Entity
 * Pages epic - not part of this ticket). Renders only the current page's
 * own label so the layout has the right slot/spacing without fabricating
 * a browsing history we don't track yet.
 */
@Component({
  selector: 'app-session-placeholder',
  standalone: true,
  imports: [],
  templateUrl: './session-placeholder.component.html',
})
export class SessionPlaceholderComponent {
  /** Name of the entity currently being viewed - the trail's only entry for now. */
  @Input({ required: true }) currentLabel: string;
}
