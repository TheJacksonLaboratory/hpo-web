import { TestBed, inject } from '@angular/core/testing';

import { DiseaseService } from './disease.service';

describe('DiseaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiseaseService]
    });
  });

  it('should be created', inject([DiseaseService], (service: DiseaseService) => {
    expect(service).toBeTruthy();
  }));
});
