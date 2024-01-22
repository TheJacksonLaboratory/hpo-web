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

export interface Term extends SimpleTerm {
  definition?: string;
  altTermIds?: Array<string>;
  comment?: string;
  synonyms?: Array<string>;
  isObsolete?: boolean;
  xrefs?: Array<string>;
  purl?: string;
  descendantCount?: number;
  synonym?: string;
  matchingString?: string;
  treeCountWidth?: number;
  treeMargin?: number;
  pubmedXrefs: Array<any>;
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
  termSource: any;
}

export interface DialogData {
  association: string;
  term: string;
  type: string;
  counts: { genes?: number, diseases?: number, terms?: number };
}

export interface LoincEntry {
  id: string;
  longName: string;
}

export interface Publication {
  authors: string;
  title: string;
  journal: string;
  year: Number;
  volume: string;
  pages: string;
  pmid: string;
  inhouse: boolean;
  hpo: boolean;
  monarch: boolean;
  topicList: string[];
}

export interface Organization {
  name: string;
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


export interface Translation extends Language {
  id?: string;
  name: string;
  status: string;
}

export interface Language {
  language: string;
  language_long: string;
}

export interface PhenotypeAssociation {
    diseases: any[];
    genes: any[];
    assays: any[];
}

export interface GeneAssociation {
  diseases: any[];
  phenotypes: any[];
}

export interface DiseaseAssociation {
  disease: Disease;
  categories: {};
  genes: any[];
}

