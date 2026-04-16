import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FeatureAnnouncementService } from './feature-announcement.service';
import { Announcement } from './announcement.model';

describe('FeatureAnnouncementService', () => {
  let service: FeatureAnnouncementService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FeatureAnnouncementService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(FeatureAnnouncementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('fetches announcements from assets/announcements.json', (done) => {
    const payload: Announcement[] = [
      {
        id: '2026-04-new-ui',
        type: 'feature',
        title: 'Redesigned Homepage',
        body: 'New homepage layout is live.',
        severity: 'info',
      },
    ];

    service.fetch().subscribe((result) => {
      expect(result).toEqual(payload);
      done();
    });

    const req = httpMock.expectOne('assets/announcements.json');
    expect(req.request.method).toBe('GET');
    req.flush(payload);
  });

  it('returns an empty array when the request fails', (done) => {
    service.fetch().subscribe((result) => {
      expect(result).toEqual([]);
      done();
    });

    httpMock
      .expectOne('assets/announcements.json')
      .error(new ProgressEvent('network error'));
  });
});
