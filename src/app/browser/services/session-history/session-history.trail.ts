import { EntityType } from '../../models/models';
import { SessionStep } from './session-history.types';

/** Most steps a trail keeps; older steps are dropped as new ones are appended. */
export const MAX_STORED_STEPS = 50;

/** Most steps the breadcrumb shows before collapsing older ones. */
export const MAX_VISIBLE_STEPS = 6;

/** Route prefix of each entity page. */
const ROUTE_PREFIX: Record<EntityType, string> = {
  [EntityType.PHENOTYPE]: '/term',
  [EntityType.GENE]: '/gene',
  [EntityType.DISEASE]: '/disease',
};

/** True when both steps are the same entity page. */
function isSameStep(a: SessionStep, b: SessionStep): boolean {
  return a.entityType === b.entityType && a.id === b.id;
}

/**
 * Appends a step to the end of the trail.
 *
 * @param trail The current trail; not modified.
 * @param step The step to add.
 * @returns A new trail. Unchanged when the last step is the same entity, and
 * limited to the newest {@link MAX_STORED_STEPS} steps.
 */
export function appendStep(trail: SessionStep[], step: SessionStep): SessionStep[] {
  const last = trail[trail.length - 1];
  if (last && isSameStep(last, step)) {
    return trail;
  }
  return [...trail, step].slice(-MAX_STORED_STEPS);
}

/**
 * Starts a new trail.
 *
 * @param step The only step in the new trail.
 * @returns A trail holding just `step`.
 */
export function startTrail(step: SessionStep): SessionStep[] {
  return [step];
}

/**
 * Cuts the trail back to a step, dropping every step after it.
 *
 * @param trail The current trail; not modified.
 * @param index Index of the step to keep as the last one.
 * @returns A new trail of steps `0..index`.
 */
export function rewindToIndex(trail: SessionStep[], index: number): SessionStep[] {
  return trail.slice(0, index + 1);
}

/**
 * Cuts the trail back to the most recent occurrence of an entity.
 *
 * @param trail The current trail; not modified.
 * @param step The entity to rewind to.
 * @returns A new trail ending at the most recent matching step, or the trail
 * with `step` appended when the entity is not in it.
 */
export function rewindToEntity(trail: SessionStep[], step: SessionStep): SessionStep[] {
  for (let index = trail.length - 1; index >= 0; index--) {
    if (isSameStep(trail[index], step)) {
      return rewindToIndex(trail, index);
    }
  }
  return appendStep(trail, step);
}

/**
 * Selects the steps the breadcrumb displays.
 *
 * @param trail The full trail.
 * @returns The last {@link MAX_VISIBLE_STEPS} steps, each with its index in the
 * full trail, and whether earlier steps are hidden.
 */
export function visibleSteps(trail: SessionStep[]): {
  hasHidden: boolean;
  steps: { step: SessionStep; index: number }[];
} {
  const first = Math.max(0, trail.length - MAX_VISIBLE_STEPS);
  return {
    hasHidden: first > 0,
    steps: trail.slice(first).map((step, offset) => ({ step, index: first + offset })),
  };
}

/**
 * Builds the router commands for a step's page.
 *
 * @param step The step to link to.
 * @returns Router commands, e.g. `['/term', 'HP:0001250']`.
 */
export function stepRoute(step: SessionStep): string[] {
  return [ROUTE_PREFIX[step.entityType], step.id];
}
