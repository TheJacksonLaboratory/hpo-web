import { MatTableDataSource } from "@angular/material/table";

export interface SimpleTerm {
  id: string;
  name: string;
}
export interface Gene {
  geneSymbol: string;
  geneId: number;
  dbDiseases?: Disease[];
  hpoTermName?: Array<string>;
  hpoTermId?: object;
  matchingString?: string;
}

export interface Disease extends SimpleTerm {
  mondoId?: string;
  synonym?: string;
  description?: string;
  matchingString?: string;
}

export class EntrezGene {
  uid?: string;
  name?: string;
  maplocation?: string;
  summary?: string;
  otheraliases?: string;
  aliases?: string[];

  constructor() {
    this.otheraliases = '';
    this.aliases = [];
  }
}

export interface EntrezGeneResult {
  result: EntrezGene
}

export interface Term extends SimpleTerm {
  definition?: string;
  altTermIds?: Array<string>;
  comment?: string;
  synonyms: Array<string>;
  isObsolete?: boolean;
  xrefs?: Array<string>;
  purl?: string;
  descendantCount?: number;
  synonym?: string;
  matchingString?: string;
  treeCountWidth?: number;
  treeMargin?: number;
  publicationReferences?: Array<string>;
  translations?: Translation[];
}

export interface TermTree {
  parents: Term[];
  descendantCount?: number;
  children: Term[];
  maxTermWidth?: number;
}

export interface News {
  title: string;
  body: string;
  date: string;
  teaserTitle: string;
  monthYear?: string;
}

export interface IndividualContributer {
  lastName: string;
  firstName: string;
  location: string;
}

export interface TermCategory {
  catLabel: string;
  annotationCount: number;
  termSource: MatTableDataSource<{ frequency: string, onset: string, sources: string[] }>;
}

export interface DialogData {
  association: string;
  id: string;
  supported_download: EntityType[];
  counts: { genes?: number, diseases?: number, phenotypes?: number };
}

export interface LoincEntry {
  id: string;
  longName: string;
}

export interface Publication {
  authors: string;
  title: string;
  journal: string;
  year: number;
  volume: string;
  pages: string;
  pmid: string;
  inhouse: boolean;
  hpo: boolean;
  monarch: boolean;
  topicList: string[];
}

export interface Organization extends SimpleTerm {
  description?: string;
  image: string;
  link?: string;
  alumni?: boolean;
  members: TeamMember[];
}

export interface TeamMember {
  name: string;
  role: string;
  link?: string;
  alumni?: boolean;
}

export interface Translation extends Language, SimpleTerm {
  name: string;
  status: string;
}

export interface Language {
  language: string;
  language_long: string;
}

export interface OntologySearchResponse {
  terms: Term[];
}

export interface PhenotypeAssociation {
  diseases: OntologyAnnotationDisease[];
  genes: SimpleTerm[];
  assays: SimpleTerm[];
  medicalActions: MedicalActionSourceExtended[];
}

export interface GeneAssociation {
  diseases: OntologyAnnotationDisease[];
  phenotypes: SimpleTerm[];
}

export interface DiseaseAssociation {
  disease: Disease;
  categories: object;
  genes: SimpleTerm[];
  medicalActions: MedicalActionSourceExtended[];
}

export enum EntityType {
  PHENOTYPE,
  DISEASE,
  GENE
}

export interface MedicalActionSourceExtended extends SimpleTerm {
  relations: string[];
  sources: string[];
}

export interface MedicalActionTargetExtended extends SimpleTerm {
  targets: string[];
  sources: string[];
}

export interface OntologyAnnotationDisease extends SimpleTerm {
  mondoId: string;
  description: string;
}

export interface OntologyAnnotationSearchResult<T extends SimpleTerm> {
  results: T[];
  totalCount: number;
}