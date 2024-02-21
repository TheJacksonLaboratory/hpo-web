import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { SearchService } from '../../../shared/search/service/search.service';

import { OntologyService } from './ontology.service';

describe('OntologyService', () => {
  let service: OntologyService;
  const query = 'HP:00005';
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(OntologyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle the search service method ', inject([
    HttpTestingController, OntologyService
  ], (httpMock, ontologyService: OntologyService) => {

    ontologyService.search(query, 10).subscribe(termResponse => {
      expect(termResponse).toBeDefined();
      expect(termResponse.terms.length).toBe(3);
      expect(termResponse.terms[0].id).toEqual("HP:0000014");
      expect(termResponse.terms[1].descendantCount).toEqual(24);
    });

    const request = httpMock.expectOne(environment.ONTOLOGY_API_HP_SEARCH + '?q=' + query + '&limit=10');

    expect(request.request.method).toEqual('GET');

    request.flush(
      {
        "terms": [
          {
            "name": "Abnormality of the bladder",
            "descendantCount": 42,
            "id": "HP:0000014"
          },
          {
            "name": "Abnormality of bladder morphology",
            "descendantCount": 24,
            "id": "HP:0025487"
          },
          {
            "name": "Abnormality of the gallbladder",
            "descendantCount": 17,
            "id": "HP:0005264"
          }]
      });
    // make sure it actually got processed...
    httpMock.verify();
  }));

  it('should handle parent service method ', inject([
    HttpTestingController, OntologyService
  ], (httpMock, ontologyService: OntologyService) => {

    ontologyService.parents(query).subscribe(termResponse => {
      expect(termResponse).toBeDefined();
      expect(termResponse[0].id).toEqual("HP:0001238");
      expect(termResponse[1].id).toEqual("HP:0100807");
    });

    const request = httpMock.expectOne(environment.ONTOLOGY_API_HP_TERMS + query +'/parents');

    expect(request.request.method).toEqual('GET');

    request.flush(
      [
        {
          "id": "HP:0001238",
          "name": "Slender finger",
          "translations": null,
          "descendantCount": 1
        },
        {
          "id": "HP:0100807",
          "name": "Long fingers",
          "translations": null,
          "descendantCount": 2
        }
      ]
    );
    httpMock.verify();
  }));

  it('should handle children service method ', inject([
    HttpTestingController, OntologyService
  ], (httpMock, ontologyService: OntologyService) => {

    ontologyService.children(query).subscribe(termResponse => {
      expect(termResponse).toBeDefined();
      expect(termResponse[0].id).toEqual("HP:0001238");
      expect(termResponse[1].id).toEqual("HP:0100807");
    });

    const request = httpMock.expectOne(environment.ONTOLOGY_API_HP_TERMS + query +'/children');

    expect(request.request.method).toEqual('GET');

    request.flush(
      [
        {
          "id": "HP:0001238",
          "name": "Slender finger",
          "translations": null,
          "descendantCount": 1
        },
        {
          "id": "HP:0100807",
          "name": "Long fingers",
          "translations": null,
          "descendantCount": 2
        }
      ]
    );

    httpMock.verify();
  }));



});
