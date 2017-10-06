export class Term{
    id: string;
    name: string;
    definition: string;
    altTermIds: Array<string>;
    comment: string;
    synonyms: Array<string>;
    isObsolete: boolean;
    xrefs: Array<string>;
    purl: string;
    constructor(){
    }
}
