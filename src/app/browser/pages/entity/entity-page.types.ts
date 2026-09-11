import {
  Disease,
  EntityType,
  EntrezGene,
  Language,
  MedicalActionSourceExtended,
  OntologyAnnotationDisease,
  SimpleTerm,
  Term,
  TermTree,
} from '../../models/models';

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

/** View model backing the gene entity page. */
export interface GenePageViewModel extends EntityPageViewModelBase {
  kind: EntityType.GENE;
  /**
   * The Entrez record behind the summary: symbol, cytogenetic location,
   * RefSeq definition and aliases.
   */
  gene: EntrezGene;
  /** Phenotypes annotated to this gene. */
  phenotypeAssoc: SimpleTerm[];
  /** Diseases this gene is associated with. */
  diseaseAssoc: OntologyAnnotationDisease[];
  /** True when the Entrez lookup failed, which hides the summary fields. */
  entrezError: boolean;
  /** True when the annotation call failed, which shows an error in each section. */
  networkError: boolean;
}

/**
 * One phenotype annotated to a disease, flattened out of the API's
 * category-keyed map so the table can render and group a single list.
 */
export interface DiseasePhenotypeRow extends SimpleTerm {
  /** Body-system label this phenotype is grouped under, e.g. `Head and neck`. */
  category: string;
  /** How many phenotypes share this row's {@link category}. */
  categoryCount: number;
  /** Age of onset, or `-` when the annotation carries none. */
  onset: string;
  /** How often the phenotype presents, or `-` when the annotation carries none. */
  frequency: string;
  /** Provenance ids for the annotation - PMIDs, bookshelf URLs, database ids. */
  sources: string[];
}

/** View model backing the disease entity page. */
export interface DiseasePageViewModel extends EntityPageViewModelBase {
  kind: EntityType.DISEASE;
  /** The resolved disease. */
  disease: Disease;
  /** Phenotypes annotated to this disease, ordered by body system. */
  phenotypeAssoc: DiseasePhenotypeRow[];
  /** Genes associated with this disease. */
  geneAssoc: SimpleTerm[];
  /**
   * True when the annotation call failed, which renders both association
   * sections as an error block.
   */
  networkError: boolean;
}

/**
 * Discriminated union of every entity page's view model, keyed by
 * {@link EntityPageViewModelBase.kind}.
 */
export type EntityPageViewModel = TermPageViewModel | GenePageViewModel | DiseasePageViewModel;
