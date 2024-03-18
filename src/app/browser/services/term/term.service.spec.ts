import {TermService} from './term.service';
import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TermServiceSpec', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TermService]
    });
  });

});
