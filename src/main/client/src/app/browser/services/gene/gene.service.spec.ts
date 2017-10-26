import { TestBed, inject } from '@angular/core/testing';

import { GeneService } from './gene.service';
import {MockBackend, MockConnection} from "@angular/http/testing";
import {BaseRequestOptions, Http, ResponseOptions, Response, RequestMethod} from "@angular/http";

describe('GeneService', () => {

  let subject: GeneService = null;
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
        GeneService
      ]
    });
  });

  beforeEach(inject( [GeneService, MockBackend], (geneEntrezService: GeneService, mockBackend: MockBackend) => {
    subject = geneEntrezService;
    backend = mockBackend;

  }));

  it('should be created', inject([GeneService], (service: GeneService) => {
    expect(service).toBeTruthy();
  }));
});
