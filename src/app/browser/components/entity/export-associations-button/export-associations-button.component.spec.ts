import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogService } from '../../../../shared/dialog-excel-download/dialog.service';
import { ExportAssociationsButtonComponent } from './export-associations-button.component';

describe('ExportAssociationsButtonComponent', () => {
  let fixture: ComponentFixture<ExportAssociationsButtonComponent>;
  let dialogService: { openDownloadDialog: jest.Mock };

  beforeEach(async () => {
    dialogService = { openDownloadDialog: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ExportAssociationsButtonComponent],
      providers: [{ provide: DialogService, useValue: dialogService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportAssociationsButtonComponent);
    fixture.componentInstance.id = 'HP:0001250';
  });

  it('is disabled when every count is zero', () => {
    fixture.componentInstance.counts = { diseases: 0, genes: 0 };
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button').disabled).toBe(true);
  });

  it('is enabled when at least one count is non-zero', () => {
    fixture.componentInstance.counts = { diseases: 0, genes: 3 };
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button').disabled).toBe(false);
  });

  it('opens the download dialog with the id and counts on click', () => {
    fixture.componentInstance.counts = { diseases: 2, genes: 1 };
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(dialogService.openDownloadDialog).toHaveBeenCalledWith('HP:0001250', { diseases: 2, genes: 1 });
  });
});
