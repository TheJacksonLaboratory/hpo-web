import { Injectable, Signal, signal } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { EntityType } from '../../models/models';
import { SessionStep, SessionTrail } from './session-history.types';
import {
  appendStep,
  clearTrail,
  emptyTrail,
  moveTo,
  moveToEntity,
  startTrail,
  stepRoute,
} from './session-history.trail';

/** sessionStorage key holding the serialized trail. */
const STORAGE_KEY = 'hpo.sessionHistory';

/** URLs of the entity pages that count as steps. */
const ENTITY_URL = /^\/(term|gene|disease)\//;

/** What the router was doing when the current navigation started. */
export interface NavigationContext {
  /** True when the page being left was an entity page. */
  fromEntity: boolean;
  /** True when the navigation is a browser Back or Forward. */
  isPopstate: boolean;
  /** Index of the trail step the navigation was started towards by {@link SessionHistoryService.goTo}, if any. */
  goToIndex: number | undefined;
}

/**
 * Tracks the entity pages visited in the current browser tab and keeps the
 * trail in sessionStorage so it survives reloads.
 *
 * The entity page reports each resolved entity through {@link record}; the
 * breadcrumb reads {@link trail}, moves through it with {@link goTo} and empties
 * it with {@link clear}.
 */
@Injectable({ providedIn: 'root' })
export class SessionHistoryService {
  private readonly state = signal<SessionTrail>(this.load());

  /** The steps visited and which one is on screen. */
  readonly trail: Signal<SessionTrail> = this.state.asReadonly();

  /** Context of the navigation in flight, set at `NavigationStart`. */
  private context: NavigationContext | undefined;

  /** Set by {@link goTo} until the `NavigationStart` it triggers consumes it. */
  private pendingGoTo: number | undefined;

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.context = {
          fromEntity: ENTITY_URL.test(this.router.url),
          isPopstate: event.navigationTrigger === 'popstate',
          goToIndex: this.pendingGoTo,
        };
        this.pendingGoTo = undefined;
      }
    });
  }

  /**
   * Records the entity page that has just resolved.
   *
   * The first matching case applies: a navigation started by {@link goTo} makes
   * that step current; the same entity as the current step (reload) adds
   * nothing; Back or Forward moves to the entity's most recent step; arriving
   * from an entity page appends; any other arrival starts a new trail.
   *
   * @param step The resolved entity.
   * @param context The context of the navigation that produced the page, from
   * {@link captureContext}. Defaults to the navigation currently in flight.
   */
  record(step: SessionStep, context: NavigationContext | undefined = this.context): void {
    const current = this.state();
    const shown = current.steps[current.current];
    const sameEntity = (other: SessionStep | undefined) =>
      !!other && other.entityType === step.entityType && other.id === step.id;

    if (context?.goToIndex !== undefined && sameEntity(current.steps[context.goToIndex])) {
      this.update(moveTo(current, context.goToIndex));
    } else if (sameEntity(shown)) {
      return;
    } else if (context?.isPopstate || context?.goToIndex !== undefined) {
      this.update(moveToEntity(current, step));
    } else if (context?.fromEntity) {
      this.update(appendStep(current, step));
    } else {
      this.update(startTrail(step));
    }
  }

  /**
   * Snapshots the context of the navigation in flight, to pass to {@link record}
   * once that navigation's page has resolved.
   *
   * @returns The context, or undefined before any navigation has started.
   */
  captureContext(): NavigationContext | undefined {
    return this.context;
  }

  /**
   * Navigates to a step already in the trail. The trail is unchanged until that
   * page has resolved, then the step becomes current.
   *
   * @param index Index of the step in the trail.
   */
  goTo(index: number): void {
    const target = this.state().steps[index];
    if (!target) {
      return;
    }
    this.pendingGoTo = index;
    this.router.navigate(stepRoute(target));
  }

  /** Drops every step except the page on screen. */
  clear(): void {
    this.update(clearTrail(this.state()));
  }

  /** Replaces the trail and writes it to sessionStorage; storage failures leave it in memory only. */
  private update(next: SessionTrail): void {
    this.state.set(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      return;
    }
  }

  /** Reads the stored trail, or an empty one when it is missing, unreadable or malformed. */
  private load(): SessionTrail {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw === null ? null : JSON.parse(raw);
      return isSessionTrail(parsed) ? parsed : emptyTrail();
    } catch {
      return emptyTrail();
    }
  }
}

/** Type guard for a stored trail. */
function isSessionTrail(value: unknown): value is SessionTrail {
  const trail = value as SessionTrail;
  return (
    typeof trail === 'object' &&
    trail !== null &&
    Array.isArray(trail.steps) &&
    trail.steps.every(isSessionStep) &&
    Number.isInteger(trail.current) &&
    trail.current < trail.steps.length &&
    (trail.steps.length === 0 ? trail.current === -1 : trail.current >= 0)
  );
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
    Object.values(EntityType).includes(step.entityType) &&
    (step.skipped === undefined || (Number.isInteger(step.skipped) && step.skipped > 0))
  );
}
