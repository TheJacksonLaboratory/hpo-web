import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { EntityType } from '../../browser/models/models';
import { DialogExcelDownloadComponent } from './dialog-excel-download.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public dialog: MatDialog) {
  }

  openDownloadDialog(identifier: string, counts: object) {
    const dialogRef = this.dialog.open(DialogExcelDownloadComponent, {
      width: '400px',
      data: {
        id: identifier,
        supported_download: this.getSupportedDownloadTypes(this.typeFromId(identifier)),
        counts: counts
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.downloadAssociations(identifier, result);
      }
    });
  }

  downloadAssociations(id: string, association: EntityType): void {
    console.log(id);
    console.log(association);
    window.open(environment.ONTOLOGY_NETWORK_ANNOTATION_API + id + '/download/' + association.toString().toLowerCase(),
      '_self');
  }

  typeFromId(id: string): EntityType {
    id = id.toUpperCase();
    if (id.includes("HP")) {
      return EntityType.PHENOTYPE;
    } else if (id.includes("OMIM") || id.includes("MONDO") || id.includes("ORPHA") || id.includes("DECIPHER")) {
      return EntityType.DISEASE;
    } else if (id.includes("NCBIGENE")) {
      return EntityType.GENE;
    }
  }

  getSupportedDownloadTypes(type: EntityType): EntityType[] {
    if (type == EntityType.PHENOTYPE) {
      return [EntityType.DISEASE, EntityType.GENE];
    } else if (type == EntityType.DISEASE) {
      return [EntityType.PHENOTYPE, EntityType.GENE];
    } else if (type == EntityType.GENE) {
      return [EntityType.PHENOTYPE, EntityType.DISEASE];
    } else {
      return [];
    }
  }
}
