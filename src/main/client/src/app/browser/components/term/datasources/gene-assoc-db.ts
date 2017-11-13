import { GeneAssoc } from '../gene-assoc';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
export class GeneAssocDB {
    /** Stream that emits whenever the data has been modified. */
    dataChange: BehaviorSubject<GeneAssoc[]> = new BehaviorSubject<GeneAssoc[]>([]);
    get data(): GeneAssoc[] { return this.dataChange.value; }

    constructor(private _genes: any) {
        this.dataChange.next(_genes);
    }
}
