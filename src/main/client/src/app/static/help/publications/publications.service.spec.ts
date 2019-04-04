import { TestBed } from '@angular/core/testing';
import { PublicationsService } from './publications.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PublicationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule],
    providers: [PublicationsService]}));

  it('should be created', () => {
    const service: PublicationsService = TestBed.get(PublicationsService);
    expect(service).toBeTruthy();
  });
});
