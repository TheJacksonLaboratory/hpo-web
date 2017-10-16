import { TestBed, inject } from '@angular/core/testing';

import { GeneService } from './gene.service';

describe('GeneService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeneService]
    });
  });

  it('should be created', inject([GeneService], (service: GeneService) => {
    expect(service).toBeTruthy();
  }));
});
