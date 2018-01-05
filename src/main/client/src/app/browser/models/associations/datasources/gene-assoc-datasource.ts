import { Observable } from 'rxjs/Observable';
import { GeneAssocDB } from './associations-db';
import { MatSort } from '@angular/material';
import { Gene } from '../../models';
import { DataSource } from '@angular/cdk/collections';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
export class GeneAssocDatasource extends DataSource<any> {
    constructor(private db: GeneAssocDB, private _sort: MatSort) {
      super();
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Gene[]> {
      const displayDataChanges = [
        this.db.dataChange,
        this._sort.sortChange,
      ];
      return Observable.merge(...displayDataChanges).map(() => {
        return this.db.data;
      });
    }

    disconnect() {}

    /** Returns a sorted copy of the database data. */
    /*getSortedData(): any[] {
      const data = this._data.slice();
      if (!this._sort.active || this._sort.direction == '') { return data; }

      return data.sort((a, b) => {
        let propertyA: number|string = '';
        let propertyB: number|string = '';

        switch (this._sort.active) {
          case 'userId': [propertyA, propertyB] = [a.id, b.id]; break;
          case 'userName': [propertyA, propertyB] = [a.name, b.name]; break;
          case 'progress': [propertyA, propertyB] = [a.progress, b.progress]; break;
          case 'color': [propertyA, propertyB] = [a.color, b.color]; break;
        }

        let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

        return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
      });
    }*/
  }
