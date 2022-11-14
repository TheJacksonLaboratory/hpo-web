import { TestBed } from '@angular/core/testing';

import { UtilityService } from './utility.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UtilityService', () => {
  let service: UtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
