import { TestBed, inject } from '@angular/core/testing';
import {MockBackend, MockConnection} from "@angular/http/testing";
import {BaseRequestOptions, Http, ResponseOptions, Response, RequestMethod} from "@angular/http";

import { SearchService } from './search.service';


describe('SearchServiceService', () => {

  let subject: SearchService = null;
  let backend: MockBackend = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend,  defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        SearchService
      ]
    });
  });

  beforeEach(inject( [SearchService, MockBackend], (geneEntrezService: SearchService, mockBackend: MockBackend) => {
    subject = geneEntrezService;
    backend = mockBackend;

  }));

  it('should be created', inject([SearchService], (service: SearchService) => {
    expect(service).toBeTruthy();
  }));
});
