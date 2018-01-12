import { Gene, Disease, Term} from '../../models';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
export class GeneAssocDB {
    /** Stream that emits whenever the data has been modified. */
    dataChange: BehaviorSubject<Gene[]> = new BehaviorSubject<Gene[]>([]);
    get data(): Gene[] { return this.dataChange.value; }

    constructor(private _genes: any) {
        this.dataChange.next(_genes);
    }
}
export class DiseaseAssocDB {
    /** Stream that emits whenever the data has been modified. */
    dataChange: BehaviorSubject<Disease[]> = new BehaviorSubject<Disease[]>([]);
    get data(): Disease[] { return this.dataChange.value; }

    constructor(private _diseases: any) {
        this.dataChange.next(_diseases);
    }
}

export class TermAssocDB {
    /** Stream that emits whenever the data has been modified. */
    dataChange: BehaviorSubject<Term[]> = new BehaviorSubject<Term[]>([]);
    get data(): Term[] { return this.dataChange.value; }

    constructor(private _terms: any) {
        this.dataChange.next(_terms);
    }
}

