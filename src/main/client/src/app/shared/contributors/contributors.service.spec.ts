import { TestBed, inject } from '@angular/core/testing';
import { ContributorsService } from './contributors.service';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { environment } from "../../../environments/environment";
import { Contributors } from "../../browse/models/models";

describe('ContributorsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [ContributorsService]
    });
  });

  it('should be created', inject([ContributorsService], (service: ContributorsService) => {
    expect(service).toBeTruthy();
  }));

  it('should return contributors', inject([ContributorsService, HttpTestingController], (service: ContributorsService, httpMock) => {

    service.contributors = [];
    service.getContributors().subscribe(contributors =>{
      expect(contributors.length).toEqual(6);
      expect(contributors[5].firstName).toEqual("Tester");
      expect(contributors[5].lastName).toEqual("Six");
      expect(contributors[5].location).toEqual("Testing Desk 6");
    });

    const request = httpMock.expectOne(environment.HPO_CONTRIBUTORS_URL);
    expect(request.request.method).toEqual('GET');
    let fakeResponse =
      "Tester,One,Testing Desk 1\n" +
      "Tester,Two,Testing Desk 2\n" +
      "Tester,Three,Testing Desk 3\n" +
      "Tester,Four,Testing Desk 4\n" +
      "Tester,Five,Testing Desk 5\n" +
      "Tester,Six,Testing Desk 6";
    request.flush(fakeResponse);
    httpMock.verify();
  }));

});
