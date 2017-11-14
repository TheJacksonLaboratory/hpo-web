import { GeneAssoc } from './gene-assoc'
export interface DiseaseAssoc {
    db: string;
    dbId: string;
    diseaseId: string;
    diseaseName: string;
    dbGenes: GeneAssoc[]
}