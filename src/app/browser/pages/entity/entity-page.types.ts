import { EntityType, Language, MedicalActionSourceExtended, SimpleTerm, Term, TermTree } from '../../models/models';

/**
 * The surface every entity view model must expose so that
 * {@link EntityPageComponent} can render the page chrome - session trail,
 * "On this page" panel menu, export button - without knowing which entity
 * type it is showing.
 *
 * Per-type view models add their own association fields on top of this; only
 * the members declared here may be read by the shell.
 */
export interface EntityPageViewModelBase {
  /**
   * Discriminant for the {@link EntityPageViewModel} union. Narrowing on this
   * (rather than on the route's `entityType`) is what lets the template type
   * checker prove that each content component receives its own view model.
   */
  kind: EntityType;
  /** Canonical, resolved entity id - e.g. `HP:0001250`. Drives the export dialog. */
  id: string;
  /** Human-readable entity name, used for the session-history trail label. */
  title: string;
  /**
   * Row counts per downloadable association set, keyed by the name the
   * download dialog expects (`diseases`, `genes`, ...). An all-zero map
   * disables the export button.
   */
  downloadCounts: Record<string, number>;
}

/**
 * One publication cited by a term.
 *
 * Only the identifier is available today - `Term.publicationReferences` is a
 * bare `string[]` of PMIDs. The design's Publications section shows title and
 * abstract, which no current field supplies; this shape exists so those can be
 * added as fields rather than by changing the section's contract. Real citation
 * metadata is the subject of HPO-155 (annotations carry their evidence).
 */
export interface PublicationReference {
  /** Prefixed publication id, e.g. `PMID:12345678`. */
  id: string;
}

/** View model backing the phenotype (HPO term) entity page. */
export interface TermPageViewModel extends EntityPageViewModelBase {
  kind: EntityType.PHENOTYPE;
  /**
   * The id as it appeared in the route. Differs from {@link id} when the
   * requested term was obsolete and resolved to its replacement, which the
   * summary header shows as a struck-through "was" value.
   */
  paramId: string;
  /** The resolved term, with null-ish fields already defaulted for display. */
  term: Term;
  /** Immediate parents and children, with precomputed descendant-bar geometry. */
  treeData: TermTree;
  /** Diseases annotated with this phenotype. */
  diseaseAssoc: SimpleTerm[];
  /** Genes inferred to be associated with this phenotype. */
  geneAssoc: SimpleTerm[];
  /** MAxO medical actions annotated against this phenotype. */
  medicalActions: MedicalActionSourceExtended[];
  /** LOINC assays associated with this phenotype. */
  loincAssoc: SimpleTerm[];
  /** Publications cited by this term, id-only for now. */
  publications: PublicationReference[];
  /**
   * Languages this term has translations for, always led by the default
   * language. Empty when the term has no translations, in which case the
   * language selector is hidden.
   */
  languages: Language[];
  /**
   * True when the annotation network call failed. The term itself still
   * resolved, so the page renders with every association section showing an
   * error block instead of failing the whole route.
   */
  networkError: boolean;
}

/**
 * Discriminated union of every entity page's view model, keyed by
 * {@link EntityPageViewModelBase.kind}.
 *
 * Widens to `TermPageViewModel | GenePageViewModel | DiseasePageViewModel`
 * once those are added in the gene/disease steps - see
 * `docs/adr/0001-HPO-68-unified-entity-page.md`.
 */
export type EntityPageViewModel = TermPageViewModel;
