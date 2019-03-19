import { TestBed, inject } from '@angular/core/testing';
import { NewsService } from './news.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { allMockNews, subMockNews } from './news.mock';

describe('NewsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NewsService]
    });
  });

  it('should be created', inject([NewsService], (service: NewsService) => {
    expect(service).toBeTruthy();
  }));

  it('should return unique dates and current date items', inject([
    HttpTestingController, NewsService
  ], (httpMock, newsService: NewsService) => {
    newsService['allNews'] = subMockNews;

    // call our service, and once the results come in
    // expect them to have the proper data (filled in
    // using the mock below)
    newsService.getUniqueDates().subscribe(dates => {
      expect(dates).toBeDefined();
      expect(dates.length).toBe(2);
      expect(dates[0]).toEqual('April 2018');
      expect(dates[1]).toEqual('March 2018');
    });

    newsService.getNewsByDate('April 2018').subscribe(dates => {
      expect(dates.length).toBe(2);
      expect(dates[0].body).toEqual('fake test body1');
      expect(dates[1].body).toEqual('fake test body2');
    });
  }));

  it('should get 3 most recent news items by date', inject([
    HttpTestingController, NewsService
  ], (httpMock, newsService: NewsService) => {
    newsService['allNews'] = allMockNews;
    newsService.getTeaserNews().subscribe(teaserNews => {
      expect(teaserNews).toBeDefined();
      expect(teaserNews.length).toBe(3);
      expect(teaserNews[0].date).toEqual('December 17, 2019');
      expect(teaserNews[1].date).toEqual('April 10, 2018');
      expect(teaserNews[2].date).toEqual('April 9, 2018');
    });

  }));
});
