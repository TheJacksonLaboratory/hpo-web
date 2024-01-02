import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DialogExcelDownloadComponent} from './dialog-excel-download.component';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public dialog: MatDialog) {
  }

  openDownloadDialog(identifier: string, type: string, counts: object,) {
    const dialogRef = this.dialog.open(DialogExcelDownloadComponent, {
      width: '400px',
      data: {
        term: identifier,
        type: type,
        counts: counts
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.downloadAssociations(identifier, result, type);
      }
    });
  }

  downloadAssociations(term: string, association: string, type: string): void {
    let url = '';
    if (type === 'disease') {
      url = environment.HPO_API_DOWNLOAD_EXCEL_DISEASE_PATH;
    } else if (type === 'gene') {
      url = environment.HPO_API_DOWNLOAD_EXCEL_GENE_PATH;
    } else {
      url = environment.HPO_API_DOWNLOAD_EXCEL_TERM_PATH;
    }
    window.open(url + '?identifier=' + term + '&association=' + association,
      '_self');
  }
}
