import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AnnouncementService } from './announcement.service';
import { FeatureAnnouncementService } from './feature-announcement.service';
import { ReleaseAnnouncementService } from './release-announcement.service';
import { Announcement } from './announcement.model';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AnnouncementService', () => {
  const feature: Announcement = {
    id: 'feat-1',
    type: 'feature',
    title: 'New Feature',
    body: 'body',
  };
  const release: Announcement = {
    id: 'release-v1',
    type: 'release',
    title: 'HPO v1 Released',
    body: 'body',
  };

  let service: AnnouncementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AnnouncementService,
        {
          provide: FeatureAnnouncementService,
          useValue: { fetch: () => of([feature]) },
        },
        {
          provide: ReleaseAnnouncementService,
          useValue: { fetch: () => of([release]) },
        },
      provideHttpClientTesting()],
    });
    service = TestBed.inject(AnnouncementService);
  });

  it('merges announcements from every source', (done) => {
    service.getAnnouncements().subscribe((result) => {
      expect(result).toEqual([feature, release]);
      done();
    });
  });
});
