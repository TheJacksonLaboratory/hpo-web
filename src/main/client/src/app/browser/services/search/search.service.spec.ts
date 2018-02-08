import {SearchService} from './search.service';
import {TestBed, inject} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from "../../../../environments/environment";

describe('SearchServiceSpec', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchService]
    })
  });
  let query = "bladder";

  it('should handle a searchAll service method ', inject([
    HttpTestingController, SearchService
  ], (httpMock, searchService: SearchService) => {
    // call our service, and once the results come in
    // expect them to have the proper data (filled in
    // using the mock below)
    searchService.searchAll(query).subscribe(searchResponse => {
      expect(searchResponse).toBeDefined();
      expect(searchResponse.terms.length).toBe(3);
      expect(searchResponse.terms[1].id).toEqual(9924);
      expect(searchResponse.terms[1].childrenCount).toEqual(24);
    });

    // look up our request and access it
    const request = httpMock.expectOne(environment.HPO_API_SEARCH_URL + '?q=' + query);
    // verify it is a GET
    expect(request.request.method).toEqual('GET');
    // Now, provide the answer to the caller above,
    // flushing the data down the pipe to the caller and
    // triggering the test's subscribe method
    request.flush(
      {
        "terms":[
          {
            "name":"Abnormality of the bladder",
            "id":14,"childrenCount":42,
            "ontologyId":"HP:0000014"
          },
          {
            "name":"Abnormality of bladder morphology",
            "id":9924,
            "childrenCount":24,
            "ontologyId":"HP:0025487"
          },
          {
            "name":"Abnormality of the gallbladder",
            "id":3972,
            "childrenCount":17,
            "ontologyId":"HP:0005264"
          }]});
    // make sure it actually got processed...
    httpMock.verify();
  }));
});
