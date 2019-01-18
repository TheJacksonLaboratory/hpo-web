import { TestBed } from '@angular/core/testing';

import { PublicationsService } from './publications.service';

describe('PublicationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PublicationsService = TestBed.get(PublicationsService);
    expect(service).toBeTruthy();
  });
});
