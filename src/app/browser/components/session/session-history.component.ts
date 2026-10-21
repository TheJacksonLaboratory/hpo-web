import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EntityType } from '../../models/models';
import { SessionHistoryService } from '../../services/session-history/session-history.service';
import { SessionStep } from '../../services/session-history/session-history.types';
import { stepRoute, visibleSteps } from '../../services/session-history/session-history.trail';

/** PrimeIcons class for each entity type's step icon. */
const TYPE_ICON: Record<EntityType, string> = {
  [EntityType.PHENOTYPE]: 'pi-bullseye',
  [EntityType.DISEASE]: 'pi-wave-pulse',
  [EntityType.GENE]: 'pi-share-alt',
};

/**
 * The "Session History" breadcrumb: the entity pages visited in this tab, in
 * order, each linking back to its page.
 *
 * Shows the six most recent steps behind a leading "..." when the trail is
 * longer. The last step is the page on screen and is not a link. Clicking an
 * earlier step cuts the trail back to it through {@link SessionHistoryService.rewindTo}.
 */
@Component({
  selector: 'app-session-history',
  standalone: true,
  templateUrl: './session-history.component.html',
})
export class SessionHistoryComponent {
  private readonly history = inject(SessionHistoryService);
  private readonly router = inject(Router);

  /** The steps to display, each with its index in the full trail. */
  readonly view = computed(() => visibleSteps(this.history.steps()));

  /**
   * PrimeIcons classes for a step's type icon.
   *
   * @param step The step to show.
   */
  iconClass(step: SessionStep): string {
    return `pi ${TYPE_ICON[step.entityType]}`;
  }

  /**
   * URL of a step's page, used as the link target.
   *
   * @param step The step to link to.
   */
  href(step: SessionStep): string {
    return this.router.serializeUrl(this.router.createUrlTree(stepRoute(step)));
  }

  /**
   * Rewinds the trail to a clicked step. Modified clicks (new tab, new window)
   * are left to the browser.
   *
   * @param event The click event.
   * @param index Index of the clicked step in the full trail.
   */
  onStepClick(event: MouseEvent, index: number): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    this.history.rewindTo(index);
  }
}
