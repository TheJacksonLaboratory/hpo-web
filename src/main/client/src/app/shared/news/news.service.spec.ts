import { TestBed, inject } from '@angular/core/testing';
import { NewsService } from './news.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {environment} from "../../../environments/environment";

describe('NewsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [NewsService]
    });
  });

  it('should be created', inject([NewsService], (service: NewsService) => {
    expect(service).toBeTruthy();
  }));

  it('should return unique dates and current date items', inject([
    HttpTestingController, NewsService
  ], (httpMock,  newsService: NewsService) => {
    newsService["allNews"] = {
      "April 2018": [
        {
          "title": "Paper on novel annotation model",
          "date": "April 9, 2018",
          "body": "fake test body1",
          "teaserTitle": "Novel annotation model"
        },
        {
          "title": "Nature Genetics Paper on layperson vocabulary",
          "date": "April 9, 2018",
          "body": "fake test body2",
          "teaserTitle": "Layperson vocabulary: Nature Genetics"
        }
      ],
      "March 2018": [
        {
          "title": "March 2018 release",
          "date": "March 9, 2018",
          "body": "fake test body3",
          "teaserTitle": "March 2018 Release"
        }
      ]};

    // call our service, and once the results come in
    // expect them to have the proper data (filled in
    // using the mock below)
    newsService.getUniqueDates().subscribe(dates => {
      expect(dates).toBeDefined();
      expect(dates.length).toBe(2);
      expect(dates[0]).toEqual("April 2018");
      expect(dates[1]).toEqual("March 2018");
    });

    newsService.getNewsByDate("April 2018").subscribe(dates => {
      expect(dates.length).toBe(2);
      expect(dates[0].body).toEqual("fake test body1");
      expect(dates[1].body).toEqual("fake test body2");

    })
  }));
});
