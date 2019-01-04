import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogExcelDownloadComponent } from './dialog-excel-download.component';

describe('DialogExcelDownloadComponent', () => {
  let component: DialogExcelDownloadComponent;
  let fixture: ComponentFixture<DialogExcelDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogExcelDownloadComponent ]
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
