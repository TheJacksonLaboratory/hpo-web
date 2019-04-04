import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogExcelDownloadComponent } from './dialog-excel-download.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material";
import {DialogData} from "../../browser/models/models";


describe('DialogExcelDownloadComponent', () => {
  let component: DialogExcelDownloadComponent;
  let fixture: ComponentFixture<DialogExcelDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogExcelDownloadComponent ],
      imports: [ MatDialogModule ],
      providers: [{provide: MatDialogRef, useValue: {}}, {provide: MAT_DIALOG_DATA,
        useValue: {'association': '', 'term': '', 'type': '', 'counts': {'genes': 0, 'diseases': 0, 'terms': 0}}}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogExcelDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
