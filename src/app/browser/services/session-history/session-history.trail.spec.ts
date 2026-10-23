import { EntityType } from '../../models/models';
import { RowItem, SessionStep, SessionTrail } from './session-history.types';
import {
  MAX_STORED_STEPS,
  appendStep,
  clearTrail,
  emptyTrail,
  layoutRow,
  moveTo,
  moveToEntity,
  startTrail,
  stepRoute,
} from './session-history.trail';

const hypertension: SessionStep = { entityType: EntityType.PHENOTYPE, id: 'HP:0000822', label: 'Hypertension' };
const ptbp1: SessionStep = { entityType: EntityType.GENE, id: 'NCBIGene:5725', label: 'PTBP1' };
const labile: SessionStep = { entityType: EntityType.PHENOTYPE, id: 'HP:0031992', label: 'Labile Hypertension' };
const diabetes: SessionStep = { entityType: EntityType.DISEASE, id: 'MONDO:0005015', label: 'Diabetes' };

/** Builds a trail of `count` distinct phenotype steps labelled `Step 0..count-1`. */
function longSteps(count: number): SessionStep[] {
  return Array.from({ length: count }, (_, i) => ({ ...labile, id: `HP:${i}`, label: `Step ${i}` }));
}

describe('emptyTrail and startTrail', () => {
  it('emptyTrail has no steps and no current step', () => {
    expect(emptyTrail()).toEqual({ steps: [], current: -1 });
  });

  it('startTrail holds only the given step, as current', () => {
    expect(startTrail(ptbp1)).toEqual({ steps: [ptbp1], current: 0 });
  });
});

describe('appendStep', () => {
  it('starts a trail when it is empty', () => {
    expect(appendStep(emptyTrail(), hypertension)).toEqual({ steps: [hypertension], current: 0 });
  });

  it('adds a different entity at the end and makes it current', () => {
    const trail: SessionTrail = { steps: [hypertension], current: 0 };
    expect(appendStep(trail, ptbp1)).toEqual({ steps: [hypertension, ptbp1], current: 1 });
  });

  it('makes the last step current instead of repeating it', () => {
    const trail: SessionTrail = { steps: [hypertension, ptbp1], current: 0 };
    expect(appendStep(trail, ptbp1)).toEqual({ steps: [hypertension, ptbp1], current: 1 });
  });

  it('keeps a repeated entity that is not consecutive', () => {
    const trail: SessionTrail = { steps: [hypertension, ptbp1], current: 1 };
    expect(appendStep(trail, hypertension).steps).toEqual([hypertension, ptbp1, hypertension]);
  });

  it('treats the same id under a different entity type as a different step', () => {
    const asDisease: SessionStep = { ...ptbp1, entityType: EntityType.DISEASE };
    expect(appendStep({ steps: [ptbp1], current: 0 }, asDisease).steps).toEqual([ptbp1, asDisease]);
  });

  it('records the steps left behind when appending from an earlier step', () => {
    const trail: SessionTrail = { steps: [hypertension, ptbp1, labile, diabetes], current: 1 };
    const result = appendStep(trail, { ...hypertension, id: 'HP:9', label: 'Edema' });

    expect(result.current).toBe(4);
    expect(result.steps[4]).toEqual({ ...hypertension, id: 'HP:9', label: 'Edema', skipped: 2 });
  });

  it('records no skipped steps when appending from the last step', () => {
    const result = appendStep({ steps: [hypertension, ptbp1], current: 1 }, labile);

    expect(result.steps[2]).toEqual(labile);
    expect('skipped' in result.steps[2]).toBe(false);
  });

  it('drops the oldest step past 50 and keeps the new step current', () => {
    const full: SessionTrail = { steps: longSteps(MAX_STORED_STEPS), current: MAX_STORED_STEPS - 1 };
    const result = appendStep(full, diabetes);

    expect(result.steps.length).toBe(MAX_STORED_STEPS);
    expect(result.steps[0].id).toBe('HP:1');
    expect(result.steps[result.current]).toEqual(diabetes);
  });

  it('does not mutate its input', () => {
    const trail: SessionTrail = { steps: [hypertension], current: 0 };
    appendStep(trail, ptbp1);
    expect(trail).toEqual({ steps: [hypertension], current: 0 });
  });
});

describe('moveTo', () => {
  it('makes the step at the index current and keeps every step', () => {
    const trail: SessionTrail = { steps: [hypertension, ptbp1, labile], current: 2 };
    expect(moveTo(trail, 0)).toEqual({ steps: [hypertension, ptbp1, labile], current: 0 });
  });

  it('ignores an index outside the trail', () => {
    const trail: SessionTrail = { steps: [hypertension], current: 0 };
    expect(moveTo(trail, 5)).toEqual(trail);
  });
});

describe('moveToEntity', () => {
  it('moves to the most recent occurrence of a repeated entity', () => {
    const trail: SessionTrail = { steps: [hypertension, ptbp1, hypertension, labile], current: 3 };
    expect(moveToEntity(trail, hypertension).current).toBe(2);
  });

  it('appends when the entity is not in the trail', () => {
    const trail: SessionTrail = { steps: [hypertension, ptbp1], current: 1 };
    expect(moveToEntity(trail, labile)).toEqual({ steps: [hypertension, ptbp1, labile], current: 2 });
  });
});

describe('clearTrail', () => {
  it('keeps only the current step, without its skipped count', () => {
    const trail: SessionTrail = { steps: [hypertension, ptbp1, { ...labile, skipped: 1 }], current: 2 };
    expect(clearTrail(trail)).toEqual({ steps: [labile], current: 0 });
  });

  it('leaves an empty trail empty', () => {
    expect(clearTrail(emptyTrail())).toEqual(emptyTrail());
  });
});

describe('stepRoute', () => {
  it('maps each EntityType to term/gene/disease', () => {
    expect(stepRoute(hypertension)).toEqual(['/term', 'HP:0000822']);
    expect(stepRoute(ptbp1)).toEqual(['/gene', 'NCBIGene:5725']);
    expect(stepRoute(diabetes)).toEqual(['/disease', 'MONDO:0005015']);
  });
});

describe('layoutRow', () => {
  const widths = (count: number) => Array.from({ length: count }, () => 100);
  const OVERFLOW = 40;
  const GAP = 0;

  /** Compact description of a row: step labels, "[x]" for current, "...<n>" for menus. */
  function describeRow(items: RowItem[]): string[] {
    return items.map((item) =>
      item.kind === 'step'
        ? item.isCurrent
          ? `[${item.step.label}]`
          : item.step.label
        : `${item.kind}:${item.hidden.map((h) => h.index).join(',')}`,
    );
  }

  it('returns nothing for an empty trail', () => {
    expect(layoutRow(emptyTrail(), [], 1000, OVERFLOW, GAP)).toEqual([]);
  });

  it('shows every step, marking the current one, when they all fit', () => {
    const trail: SessionTrail = { steps: longSteps(3), current: 2 };
    expect(describeRow(layoutRow(trail, widths(3), 1000, OVERFLOW, GAP))).toEqual(['Step 0', 'Step 1', '[Step 2]']);
  });

  it('on the newest step, hides the oldest steps behind a start menu', () => {
    const trail: SessionTrail = { steps: longSteps(8), current: 7 };
    // current 100 + start button 40 = 140; each earlier step adds 100: room for 1 more (240 <= 250).
    expect(describeRow(layoutRow(trail, widths(8), 250, OVERFLOW, GAP))).toEqual([
      'before:0,1,2,3,4,5',
      'Step 6',
      '[Step 7]',
    ]);
  });

  it('in the middle, shows neighbours on both sides with a menu at each end', () => {
    const trail: SessionTrail = { steps: longSteps(9), current: 4 };
    // 3 steps (300) + two buttons (80) = 380 fits in 450; a 4th step would not.
    expect(describeRow(layoutRow(trail, widths(9), 450, OVERFLOW, GAP))).toEqual([
      'before:0,1,2',
      'Step 3',
      '[Step 4]',
      'Step 5',
      'after:6,7,8',
    ]);
  });

  it('on the first step, hides later steps behind an end menu only', () => {
    const trail: SessionTrail = { steps: longSteps(6), current: 0 };
    expect(describeRow(layoutRow(trail, widths(6), 300, OVERFLOW, GAP))).toEqual([
      '[Step 0]',
      'Step 1',
      'after:2,3,4,5',
    ]);
  });

  it('always keeps the current step however narrow the row is', () => {
    const trail: SessionTrail = { steps: longSteps(5), current: 2 };
    expect(describeRow(layoutRow(trail, widths(5), 10, OVERFLOW, GAP))).toEqual(['before:0,1', '[Step 2]', 'after:3,4']);
  });

  it('counts the gap between items when fitting', () => {
    const trail: SessionTrail = { steps: longSteps(3), current: 2 };
    // 3 x 100 + 2 x 8 = 316 does not fit in 310, so the oldest collapses (200 + 8 + 40 + 8 = 256).
    expect(describeRow(layoutRow(trail, widths(3), 310, OVERFLOW, 8))).toEqual(['before:0', 'Step 1', '[Step 2]']);
  });

  it('collapses steps left behind by a branch into a middle menu', () => {
    const steps = longSteps(5);
    steps[4] = { ...steps[4], skipped: 2 };
    expect(describeRow(layoutRow({ steps, current: 4 }, widths(5), 1000, OVERFLOW, GAP))).toEqual([
      'Step 0',
      'Step 1',
      'gap:2,3',
      '[Step 4]',
    ]);
  });

  it('shows a skipped range in full while the current step is inside it', () => {
    const steps = longSteps(5);
    steps[4] = { ...steps[4], skipped: 2 };
    expect(describeRow(layoutRow({ steps, current: 2 }, widths(5), 1000, OVERFLOW, GAP))).toEqual([
      'Step 0',
      'Step 1',
      '[Step 2]',
      'Step 3',
      'Step 4',
    ]);
  });

  it('puts the steps of a collapsed range into the start menu when they are truncated away', () => {
    const steps = longSteps(6);
    steps[3] = { ...steps[3], skipped: 2 };
    // Row: 0, gap(1,2), 3, 4, [5]; room for the current step and its one neighbour only.
    expect(describeRow(layoutRow({ steps, current: 5 }, widths(6), 250, OVERFLOW, GAP))).toEqual([
      'before:0,1,2,3',
      'Step 4',
      '[Step 5]',
    ]);
  });

  it('does not fail when a skipped count reaches past the oldest step', () => {
    const steps = longSteps(3);
    steps[1] = { ...steps[1], skipped: 5 };
    expect(describeRow(layoutRow({ steps, current: 2 }, widths(3), 1000, OVERFLOW, GAP))).toEqual([
      'gap:0',
      'Step 1',
      '[Step 2]',
    ]);
  });
});
