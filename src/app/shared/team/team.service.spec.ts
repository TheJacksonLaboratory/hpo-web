import {inject, TestBed} from '@angular/core/testing';
import {TeamService} from './team.service';
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import {environment} from "../../../environments/environment";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TeamService', () => {
  let httpTestingController: HttpTestingController;
  let service: TeamService;
  beforeEach(() => {

    TestBed.configureTestingModule({
    imports: [],
    providers: [TeamService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TeamService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return contributors', () => {

    service.contributors = [];
    service.getContributors().subscribe(contributors => {
      expect(contributors.length).toEqual(6);
      expect(contributors[5].firstName).toEqual("Six");
      expect(contributors[5].lastName).toEqual("Tester");
      expect(contributors[5].location).toEqual("Testing Desk 6");
    });

    const request = httpTestingController.expectOne(environment.HPO_CONTRIBUTORS_URL);
    expect(request.request.method).toEqual('GET');
    let fakeResponse =
      "Tester,One,Testing Desk 1\n" +
      "Tester,Two,Testing Desk 2\n" +
      "Tester,Three,Testing Desk 3\n" +
      "Tester,Four,Testing Desk 4\n" +
      "Tester,Five,Testing Desk 5\n" +
      "Tester,Six,Testing Desk 6";
    request.flush(fakeResponse);
  });

});
