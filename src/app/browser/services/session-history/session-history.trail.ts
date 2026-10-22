import { EntityType } from '../../models/models';
import { IndexedStep, RowItem, SessionStep, SessionTrail } from './session-history.types';

/** Most steps a trail keeps; older steps are dropped as new ones are appended. */
export const MAX_STORED_STEPS = 50;

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
 * Creates a trail with no steps.
 *
 * @returns A trail whose `current` is -1.
 */
export function emptyTrail(): SessionTrail {
  return { steps: [], current: -1 };
}

/**
 * Starts a new trail.
 *
 * @param step The only step in the new trail.
 * @returns A trail holding just `step`, as current.
 */
export function startTrail(step: SessionStep): SessionTrail {
  return { steps: [step], current: 0 };
}

/**
 * Adds a step reached by following a link, and makes it current.
 *
 * The step goes at the very end of the trail. When the current step was not the
 * last one, the steps after it are recorded on the new step as `skipped`. A step
 * for the same entity as the last one is not repeated; the last step becomes
 * current instead.
 *
 * @param trail The current trail; not modified.
 * @param step The step to add.
 * @returns A new trail, limited to the newest {@link MAX_STORED_STEPS} steps.
 */
export function appendStep(trail: SessionTrail, step: SessionStep): SessionTrail {
  if (trail.steps.length === 0) {
    return startTrail(step);
  }
  const lastIndex = trail.steps.length - 1;
  if (isSameStep(trail.steps[lastIndex], step)) {
    return moveTo(trail, lastIndex);
  }
  const skipped = lastIndex - trail.current;
  const added = skipped > 0 ? { ...step, skipped } : step;
  const steps = [...trail.steps, added].slice(-MAX_STORED_STEPS);
  return { steps, current: steps.length - 1 };
}

/**
 * Makes another step current, keeping every step.
 *
 * @param trail The current trail; not modified.
 * @param index Index of the step to make current.
 * @returns A new trail, or `trail` itself when `index` is outside it.
 */
export function moveTo(trail: SessionTrail, index: number): SessionTrail {
  if (index < 0 || index >= trail.steps.length) {
    return trail;
  }
  return { steps: trail.steps, current: index };
}

/**
 * Makes the most recent step for an entity current.
 *
 * @param trail The current trail; not modified.
 * @param step The entity to move to.
 * @returns A new trail with that step current, or the trail with `step`
 * appended when the entity is not in it.
 */
export function moveToEntity(trail: SessionTrail, step: SessionStep): SessionTrail {
  for (let index = trail.steps.length - 1; index >= 0; index--) {
    if (isSameStep(trail.steps[index], step)) {
      return moveTo(trail, index);
    }
  }
  return appendStep(trail, step);
}

/**
 * Drops every step except the current one.
 *
 * @param trail The current trail; not modified.
 * @returns A trail holding only the current step, without its `skipped` count.
 */
export function clearTrail(trail: SessionTrail): SessionTrail {
  const step = trail.steps[trail.current];
  if (!step) {
    return emptyTrail();
  }
  return startTrail({ entityType: step.entityType, id: step.id, label: step.label });
}

/** A run of consecutive steps shown as one item: a single step, or a collapsed skipped range. */
interface Unit {
  /** Trail indexes the unit covers, in order. */
  indexes: number[];
  /** True for a collapsed skipped range. */
  isGap: boolean;
}

/**
 * Splits the trail into display units, collapsing the ranges steps left behind
 * unless the current step is inside the range.
 */
function toUnits(trail: SessionTrail): Unit[] {
  const { steps, current } = trail;
  const collapsed = steps.map(() => false);
  steps.forEach((step, index) => {
    if (!step.skipped) {
      return;
    }
    const start = Math.max(0, index - step.skipped);
    if (current >= start && current < index) {
      return;
    }
    for (let skipped = start; skipped < index; skipped++) {
      collapsed[skipped] = true;
    }
  });

  const units: Unit[] = [];
  steps.forEach((_, index) => {
    const last = units[units.length - 1];
    if (collapsed[index] && last?.isGap) {
      last.indexes.push(index);
    } else {
      units.push({ indexes: [index], isGap: collapsed[index] });
    }
  });
  return units;
}

/** Pairs the steps at `indexes` with their positions. */
function indexed(trail: SessionTrail, indexes: number[]): IndexedStep[] {
  return indexes.map((index) => ({ step: trail.steps[index], index }));
}

/**
 * Decides what the breadcrumb row shows for the width it has.
 *
 * Steps left behind by a branch collapse into one `gap` item each. The current
 * step is always shown, and the row grows from it, taking an earlier neighbour
 * and then a later one while they fit. Whatever lies before or after the shown
 * run collapses into a `before` or `after` item, which costs `overflowWidth`.
 *
 * @param trail The full trail.
 * @param widths Rendered width of each step, in pixels, one per step.
 * @param available Width of the row, in pixels.
 * @param overflowWidth Width of a "..." button, in pixels.
 * @param gap Space between adjacent items, in pixels.
 * @returns The row's items in display order; empty for an empty trail.
 */
export function layoutRow(
  trail: SessionTrail,
  widths: number[],
  available: number,
  overflowWidth: number,
  gap: number,
): RowItem[] {
  if (trail.current < 0 || trail.current >= trail.steps.length) {
    return [];
  }
  const units = toUnits(trail);
  const unitWidths = units.map((unit) => (unit.isGap ? overflowWidth : widths[unit.indexes[0]] ?? 0));
  const last = units.length - 1;

  const fits = (lo: number, hi: number): boolean => {
    const shown = unitWidths.slice(lo, hi + 1).reduce((sum, width) => sum + width, 0) + gap * (hi - lo);
    const before = lo > 0 ? overflowWidth + gap : 0;
    const after = hi < last ? overflowWidth + gap : 0;
    return shown + before + after <= available;
  };

  let lo = units.findIndex((unit) => unit.indexes.includes(trail.current));
  let hi = lo;
  let earlierBlocked = false;
  let laterBlocked = false;
  while (!earlierBlocked || !laterBlocked) {
    if (!earlierBlocked) {
      if (lo > 0 && fits(lo - 1, hi)) {
        lo--;
      } else {
        earlierBlocked = true;
      }
    }
    if (!laterBlocked) {
      if (hi < last && fits(lo, hi + 1)) {
        hi++;
      } else {
        laterBlocked = true;
      }
    }
  }

  const items: RowItem[] = [];
  if (lo > 0) {
    items.push({ kind: 'before', hidden: indexed(trail, units.slice(0, lo).flatMap((unit) => unit.indexes)) });
  }
  for (const unit of units.slice(lo, hi + 1)) {
    if (unit.isGap) {
      items.push({ kind: 'gap', hidden: indexed(trail, unit.indexes) });
    } else {
      const index = unit.indexes[0];
      items.push({ kind: 'step', step: trail.steps[index], index, isCurrent: index === trail.current });
    }
  }
  if (hi < last) {
    items.push({ kind: 'after', hidden: indexed(trail, units.slice(hi + 1).flatMap((unit) => unit.indexes)) });
  }
  return items;
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
