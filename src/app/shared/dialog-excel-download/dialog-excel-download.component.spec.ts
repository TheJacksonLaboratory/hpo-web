import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { EntityType } from '../../browser/models/models';
import {DialogExcelDownloadComponent} from './dialog-excel-download.component';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogModule as MatDialogModule, MatLegacyDialogRef as MatDialogRef} from "@angular/material/legacy-dialog";


describe('DialogExcelDownloadComponent', () => {
  let component: DialogExcelDownloadComponent;
  let fixture: ComponentFixture<DialogExcelDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogExcelDownloadComponent],
      imports: [MatDialogModule],
      providers: [{provide: MatDialogRef, useValue: {}}, {
        provide: MAT_DIALOG_DATA,
        useValue: {'association': '', 'id': '', 'counts': {'genes': 0, 'diseases': 0, 'terms': 0}, supported_download: [EntityType.DISEASE, EntityType.GENE]}
      }]
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
