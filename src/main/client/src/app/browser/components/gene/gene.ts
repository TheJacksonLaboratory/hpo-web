export class Gene{
    entrezGeneId: string;
    entrezGeneSymbol: string;
    hpoTermName: Array<string>;
    hpoTermId: object;
    constructor(){
    }
}


export class EntrezGene {
    "uid": string;
    "name": string;
    "maplocation" : string;
    "summary" : string;
    'otheraliases':string;
    'aliases' : string[];

}
