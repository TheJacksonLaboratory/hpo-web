import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialog.service';
import { MatDialogModule } from '@angular/material/dialog';

describe('DialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [MatDialogModule]
  }));

  it('should be created', () => {
    const service: DialogService = TestBed.inject(DialogService);
    expect(service).toBeTruthy();
  });
});
