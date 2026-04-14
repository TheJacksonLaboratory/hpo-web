import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Announcement } from './announcement.model';

@Injectable({ providedIn: 'root' })
export class AnnouncementService {

  /** Fetch active announcements. Stubbed — will eventually be backed by an API. */
  getAnnouncements(): Observable<Announcement[]> {
    return of([
      {
        id: '2026-04-new-features',
        title: 'New Features Announced!',
        body: 'HPO has added new phenotype terms and annotations.',
        link: { label: 'release notes', href: '/news' },
        severity: 'info' as const,
      },
    ]);
  }
}
