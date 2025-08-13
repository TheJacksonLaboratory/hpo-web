import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA as MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData, EntityType } from '../../browser/models/models';

@Component({
  selector: 'app-dialog-excel-download',
  templateUrl: './dialog-excel-download.component.html',
  styleUrls: ['./dialog-excel-download.component.css']
})
export class DialogExcelDownloadComponent implements OnInit {

  supported = { first: "", second: "" };

  constructor(public dialogRef: MatDialogRef<DialogExcelDownloadComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit() {
      this.supported.first = this.getEntityDisplay(this.data.supported_download[0]);
      this.supported.second = this.getEntityDisplay(this.data.supported_download[1]);
  }

  getEntityDisplay(type: EntityType): string {
    if (type === EntityType.PHENOTYPE){
      return "Phenotype";
    } else if (type === EntityType.DISEASE){
      return "Diseases";
    } else if (type === EntityType.GENE){
      return "Genes";
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  protected readonly EntityType = EntityType;
}
