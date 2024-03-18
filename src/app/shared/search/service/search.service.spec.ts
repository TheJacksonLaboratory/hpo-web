import {SearchService} from './search.service';
import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('SearchServiceSpec', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchService]
    })
  });
});
