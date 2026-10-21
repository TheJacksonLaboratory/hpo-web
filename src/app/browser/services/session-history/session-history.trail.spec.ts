import { EntityType } from '../../models/models';
import { SessionStep } from './session-history.types';
import {
  MAX_STORED_STEPS,
  MAX_VISIBLE_STEPS,
  appendStep,
  rewindToEntity,
  rewindToIndex,
  startTrail,
  stepRoute,
  visibleSteps,
} from './session-history.trail';

const hypertension: SessionStep = { entityType: EntityType.PHENOTYPE, id: 'HP:0000822', label: 'Hypertension' };
const ptbp1: SessionStep = { entityType: EntityType.GENE, id: 'NCBIGene:5725', label: 'PTBP1' };
const labile: SessionStep = { entityType: EntityType.PHENOTYPE, id: 'HP:0031992', label: 'Labile Hypertension' };
const diabetes: SessionStep = { entityType: EntityType.DISEASE, id: 'MONDO:0005015', label: 'Diabetes' };

describe('appendStep', () => {
  it('adds a different entity', () => {
    expect(appendStep([hypertension], ptbp1)).toEqual([hypertension, ptbp1]);
  });

  it('ignores the same entity twice in a row', () => {
    const trail = [hypertension, ptbp1];
    expect(appendStep(trail, { ...ptbp1, label: 'PTBP1 renamed' })).toEqual(trail);
  });

  it('keeps a repeated entity that is not consecutive', () => {
    expect(appendStep([hypertension, ptbp1], hypertension)).toEqual([hypertension, ptbp1, hypertension]);
  });

  it('treats the same id under a different entity type as a different step', () => {
    const asDisease: SessionStep = { ...ptbp1, entityType: EntityType.DISEASE };
    expect(appendStep([ptbp1], asDisease)).toEqual([ptbp1, asDisease]);
  });

  it('drops the oldest step past 50', () => {
    const full = Array.from({ length: MAX_STORED_STEPS }, (_, i) => ({ ...labile, id: `HP:${i}`, label: `Step ${i}` }));
    const result = appendStep(full, diabetes);

    expect(result.length).toBe(MAX_STORED_STEPS);
    expect(result[0].id).toBe('HP:1');
    expect(result[result.length - 1]).toEqual(diabetes);
  });

  it('does not mutate its input', () => {
    const trail = [hypertension];
    appendStep(trail, ptbp1);
    expect(trail).toEqual([hypertension]);
  });
});

describe('startTrail', () => {
  it('returns a trail holding only the given step', () => {
    expect(startTrail(ptbp1)).toEqual([ptbp1]);
  });
});

describe('rewindToIndex', () => {
  it('keeps steps up to and including the index', () => {
    expect(rewindToIndex([hypertension, ptbp1, labile], 1)).toEqual([hypertension, ptbp1]);
  });

  it('does not mutate its input', () => {
    const trail = [hypertension, ptbp1, labile];
    rewindToIndex(trail, 0);
    expect(trail.length).toBe(3);
  });
});

describe('rewindToEntity', () => {
  it('cuts to the most recent occurrence of a repeated entity', () => {
    const trail = [hypertension, ptbp1, hypertension, labile];
    expect(rewindToEntity(trail, hypertension)).toEqual([hypertension, ptbp1, hypertension]);
  });

  it('appends when the entity is not in the trail', () => {
    expect(rewindToEntity([hypertension, ptbp1], labile)).toEqual([hypertension, ptbp1, labile]);
  });
});

describe('visibleSteps', () => {
  it('returns all steps with hasHidden false at six or fewer', () => {
    const trail = [hypertension, ptbp1, labile];
    expect(visibleSteps(trail)).toEqual({
      hasHidden: false,
      steps: [
        { step: hypertension, index: 0 },
        { step: ptbp1, index: 1 },
        { step: labile, index: 2 },
      ],
    });
  });

  it('returns the last six with original indexes and hasHidden true', () => {
    const trail = Array.from({ length: MAX_VISIBLE_STEPS + 2 }, (_, i) => ({ ...labile, id: `HP:${i}`, label: `Step ${i}` }));
    const result = visibleSteps(trail);

    expect(result.hasHidden).toBe(true);
    expect(result.steps.length).toBe(MAX_VISIBLE_STEPS);
    expect(result.steps[0]).toEqual({ step: trail[2], index: 2 });
    expect(result.steps[MAX_VISIBLE_STEPS - 1]).toEqual({ step: trail[7], index: 7 });
  });

  it('returns no steps and hasHidden false for an empty trail', () => {
    expect(visibleSteps([])).toEqual({ hasHidden: false, steps: [] });
  });
});

describe('stepRoute', () => {
  it('maps each EntityType to term/gene/disease', () => {
    expect(stepRoute(hypertension)).toEqual(['/term', 'HP:0000822']);
    expect(stepRoute(ptbp1)).toEqual(['/gene', 'NCBIGene:5725']);
    expect(stepRoute(diabetes)).toEqual(['/disease', 'MONDO:0005015']);
  });
});
