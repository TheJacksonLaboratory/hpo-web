import { TestBed, inject } from '@angular/core/testing';

import { GeneEntrezService } from './gene-entrez.service';

describe('GeneEntrezService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeneEntrezService]
    });
  });

  it('should be created', inject([GeneEntrezService], (service: GeneEntrezService) => {
    expect(service).toBeTruthy();
  }));
});
