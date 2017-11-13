import { DiseaseAssoc } from '../disease-assoc';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
export class DiseaseAssocDB {
    /** Stream that emits whenever the data has been modified. */
    dataChange: BehaviorSubject<DiseaseAssoc[]> = new BehaviorSubject<DiseaseAssoc[]>([]);
    get data(): DiseaseAssoc[] { return this.dataChange.value; }
  
    constructor(private _diseases: any) {
        this.dataChange.next(_diseases);
    }
}
