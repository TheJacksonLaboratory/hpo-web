import { EntityType } from '../../models/models';

/** One entity page visited in the current browser tab. */
export interface SessionStep {
  /** Which entity page this step is. */
  entityType: EntityType;
  /** Canonical, resolved entity id - e.g. `HP:0001250`. */
  id: string;
  /** Human-readable entity name shown in the trail. */
  label: string;
  /**
   * How many of the steps immediately before this one were left behind when
   * the person followed a link from an earlier step. Absent when none were.
   */
  skipped?: number;
}

/** The steps visited in the current browser tab and which one is on screen. */
export interface SessionTrail {
  /** Every step, oldest first. */
  steps: SessionStep[];
  /** Index in {@link steps} of the page on screen, or -1 when the trail is empty. */
  current: number;
}

/** A step with its position in the trail. */
export interface IndexedStep {
  /** The step. */
  step: SessionStep;
  /** Index of the step in {@link SessionTrail.steps}. */
  index: number;
}

/** One entry in the breadcrumb row, in display order. */
export type RowItem =
  | { kind: 'step'; step: SessionStep; index: number; isCurrent: boolean }
  | { kind: 'gap'; hidden: IndexedStep[] }
  | { kind: 'before'; hidden: IndexedStep[] }
  | { kind: 'after'; hidden: IndexedStep[] };
