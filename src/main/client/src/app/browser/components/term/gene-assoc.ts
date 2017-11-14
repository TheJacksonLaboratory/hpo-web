import { DiseaseAssoc } from './disease-assoc'
export interface GeneAssoc {
    entrezGeneSymbol: string;
    entrezGeneId: number;
    dbDiseases: DiseaseAssoc[]
  }