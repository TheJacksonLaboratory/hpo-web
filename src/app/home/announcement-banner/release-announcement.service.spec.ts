import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReleaseAnnouncementService } from './release-announcement.service';

describe('ReleaseAnnouncementService', () => {
  const apiUrl =
    'https://api.github.com/repos/obophenotype/human-phenotype-ontology/releases/latest';

  let service: ReleaseAnnouncementService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReleaseAnnouncementService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ReleaseAnnouncementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('maps a GitHub release payload to an announcement', (done) => {
    service.fetch().subscribe((result) => {
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'release-v2026.04.01',
        type: 'release',
        title: 'HPO v2026.04.01 Released',
        body: 'A new version of the Human Phenotype Ontology is now available.',
        link: {
          label: 'view release notes',
          href: 'https://github.com/obophenotype/human-phenotype-ontology/releases/tag/v2026.04.01',
          external: true,
        },
        severity: 'info',
        dismissTtlDays: 365,
      });
      done();
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush({
      tag_name: 'v2026.04.01',
      html_url:
        'https://github.com/obophenotype/human-phenotype-ontology/releases/tag/v2026.04.01',
    });
  });

  it('returns an empty array when the GitHub API fails', (done) => {
    service.fetch().subscribe((result) => {
      expect(result).toEqual([]);
      done();
    });

    httpMock.expectOne(apiUrl).error(new ProgressEvent('network error'));
  });
});
