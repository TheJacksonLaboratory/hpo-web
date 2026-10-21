import { EntityType } from '../../models/models';

/** One entity page visited in the current browser tab. */
export interface SessionStep {
  /** Which entity page this step is. */
  entityType: EntityType;
  /** Canonical, resolved entity id - e.g. `HP:0001250`. */
  id: string;
  /** Human-readable entity name shown in the trail. */
  label: string;
}
