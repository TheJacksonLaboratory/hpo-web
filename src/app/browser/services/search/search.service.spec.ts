import { TestBed, inject } from '@angular/core/testing';

import { SearchServiceService } from './search-service.service';

describe('SearchServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchServiceService]
    });
  });

  it('should be created', inject([SearchServiceService], (service: SearchServiceService) => {
    expect(service).toBeTruthy();
  }));
});
