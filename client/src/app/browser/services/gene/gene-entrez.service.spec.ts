import { TestBed, inject } from '@angular/core/testing';

import { GeneEntrezService } from './gene-entrez.service';
import {MockBackend, MockConnection} from "@angular/http/testing";
import {BaseRequestOptions, Http, ResponseOptions, Response, RequestMethod} from "@angular/http";


describe('GeneEntrezService', () => {

  let subject: GeneEntrezService = null;
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
        GeneEntrezService
      ]
    });
  });

  beforeEach(inject( [GeneEntrezService, MockBackend], (geneEntrezService: GeneEntrezService, mockBackend: MockBackend) => {
    subject = geneEntrezService;
    backend = mockBackend;

  }));

  it('should be created', inject([GeneEntrezService], (service: GeneEntrezService) => {
    expect(service).toBeTruthy();
  }));
});
