import { TestBed, inject } from '@angular/core/testing';

import { DiseaseService } from './disease.service';
import {MockBackend, MockConnection} from "@angular/http/testing";
import {BaseRequestOptions, Http, ResponseOptions, Response, RequestMethod} from "@angular/http";

describe('DiseaseService', () => {

  let subject: DiseaseService = null;
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
        DiseaseService
      ]
    });
  });

  beforeEach(inject( [DiseaseService, MockBackend], (diseaseService: DiseaseService, mockBackend: MockBackend) => {
    subject = diseaseService;
    backend = mockBackend;

  }));



  it('should be created', inject([DiseaseService], (service: DiseaseService) => {
    expect(service).toBeTruthy();
  }));

  it('searchDisease should call endpoint and return it\'s result', () =>{

    const mockResponse = {
      data : [
        {dbReference: 1, dbName: 'disease 1'},
        {dbReference: 2, dbName: 'disease 2'},
        {dbReference: 3, dbName: 'disease 3'}
      ]
    };

    backend.connections.subscribe((connection: MockConnection) =>{
      let options = new ResponseOptions({
        body: JSON.stringify(mockResponse)
      });
      connection.mockRespond(new Response(options));
    });

    subject
      .searchDisease('anything')
      .then ((response) => {
          let data = response.json();
          expect(data.length(3));
          expect(data[0].name).toEqual('disease 1');
          expect(data[1].name).toEqual('disease 2');
    });

  });

});
