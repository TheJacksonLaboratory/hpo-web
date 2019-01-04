import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogData} from '../../browse/models/models';

@Component({
  selector: 'app-dialog-excel-download',
  templateUrl: './dialog-excel-download.component.html',
  styleUrls: ['./dialog-excel-download.component.css']
})
export class DialogExcelDownloadComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogExcelDownloadComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
