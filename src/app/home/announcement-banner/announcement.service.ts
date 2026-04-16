import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Announcement } from './announcement.model';
import { FeatureAnnouncementService } from './feature-announcement.service';
import { ReleaseAnnouncementService } from './release-announcement.service';

@Injectable({ providedIn: 'root' })
export class AnnouncementService {
  private features = inject(FeatureAnnouncementService);
  private releases = inject(ReleaseAnnouncementService);

  getAnnouncements(): Observable<Announcement[]> {
    return forkJoin([this.features.fetch(), this.releases.fetch()]).pipe(
      map(([features, releases]) => [...features, ...releases])
    );
  }
}
