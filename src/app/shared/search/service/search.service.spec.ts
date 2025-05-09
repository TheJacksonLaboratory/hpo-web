import {SearchService} from './search.service';
import {TestBed} from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SearchServiceSpec', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [SearchService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
  });
});
