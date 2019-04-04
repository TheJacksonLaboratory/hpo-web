import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogData} from '../../browser/models/models';

@Component({
  selector: 'app-dialog-excel-download',
  templateUrl: './dialog-excel-download.component.html',
  styleUrls: ['./dialog-excel-download.component.css']
})
export class DialogExcelDownloadComponent implements OnInit {

  buttonText = {first: '', second: ''};

  constructor(public dialogRef: MatDialogRef<DialogExcelDownloadComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    if (this.data.type === 'term') {
      this.buttonText.first = 'Diseases';
      this.buttonText.second = 'Genes';
    } else if (this.data.type === 'disease') {
      this.buttonText.first = 'Terms';
      this.buttonText.second = 'Genes';
    } else {
      this.buttonText.first = 'Diseases';
      this.buttonText.second = 'Terms';
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
