import { Injectable, Signal, signal } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { EntityType } from '../../models/models';
import { SessionStep } from './session-history.types';
import { appendStep, rewindToEntity, rewindToIndex, startTrail, stepRoute } from './session-history.trail';

/** sessionStorage key holding the serialized trail. */
const STORAGE_KEY = 'hpo.sessionHistory';

/** URLs of the entity pages that count as steps. */
const ENTITY_URL = /^\/(term|gene|disease)\//;

/** What the router was doing when the current navigation started. */
interface NavigationContext {
  /** True when the page being left was an entity page. */
  fromEntity: boolean;
  /** True when the navigation is a browser Back or Forward. */
  isPopstate: boolean;
  /** True when the navigation was started by {@link SessionHistoryService.rewindTo}. */
  isRewind: boolean;
}

/**
 * Tracks the entity pages visited in the current browser tab and keeps the
 * trail in sessionStorage so it survives reloads.
 *
 * The entity page reports each resolved entity through {@link record}; the
 * breadcrumb reads {@link steps} and rewinds through {@link rewindTo}.
 */
@Injectable({ providedIn: 'root' })
export class SessionHistoryService {
  private readonly trail = signal<SessionStep[]>(this.load());

  /** The trail of visited entity pages, oldest first. */
  readonly steps: Signal<SessionStep[]> = this.trail.asReadonly();

  /** Context of the navigation in flight, set at `NavigationStart`. */
  private context: NavigationContext | undefined;

  /** True between {@link rewindTo} and the `NavigationStart` it triggers. */
  private rewindRequested = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.context = {
          fromEntity: ENTITY_URL.test(this.router.url),
          isPopstate: event.navigationTrigger === 'popstate',
          isRewind: this.rewindRequested,
        };
        this.rewindRequested = false;
      }
    });
  }

  /**
   * Records the entity page that has just resolved.
   *
   * The first matching case applies: a rewind leaves the trail as is; the same
   * entity as the last step (reload) adds nothing; Back or Forward cuts to the
   * entity; arriving from an entity page appends; any other arrival starts a
   * new trail.
   *
   * @param step The resolved entity.
   */
  record(step: SessionStep): void {
    const context = this.context;
    const current = this.trail();
    const last = current[current.length - 1];

    if (context?.isRewind) {
      return;
    }
    if (last && last.entityType === step.entityType && last.id === step.id) {
      return;
    }
    if (context?.isPopstate) {
      this.update(rewindToEntity(current, step));
    } else if (context?.fromEntity) {
      this.update(appendStep(current, step));
    } else {
      this.update(startTrail(step));
    }
  }

  /**
   * Cuts the trail back to a step and navigates to its page.
   *
   * @param index Index of the clicked step in the full trail.
   */
  rewindTo(index: number): void {
    const target = this.trail()[index];
    if (!target) {
      return;
    }
    this.update(rewindToIndex(this.trail(), index));
    this.rewindRequested = true;
    this.router.navigate(stepRoute(target));
  }

  /** Replaces the trail and writes it to sessionStorage. */
  private update(next: SessionStep[]): void {
    this.trail.set(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable: the trail stays in memory only.
    }
  }

  /** Reads the stored trail, or an empty one when it is missing, unreadable or malformed. */
  private load(): SessionStep[] {
    try {
      const parsed: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]');
      return Array.isArray(parsed) && parsed.every(isSessionStep) ? parsed : [];
    } catch {
      return [];
    }
  }
}

/** Type guard for a stored step. */
function isSessionStep(value: unknown): value is SessionStep {
  const step = value as SessionStep;
  return (
    typeof step === 'object' &&
    step !== null &&
    typeof step.id === 'string' &&
    typeof step.label === 'string' &&
    typeof step.entityType === 'number' &&
    Object.values(EntityType).includes(step.entityType)
  );
}
