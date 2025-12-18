import { TestBed } from '@angular/core/testing';
import { PublicationsService } from './publications.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PublicationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [PublicationsService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}));

  it('should be created', () => {
    const service: PublicationsService = TestBed.get(PublicationsService);
    expect(service).toBeTruthy();
  });
});
