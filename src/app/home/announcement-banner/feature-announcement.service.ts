import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Announcement } from './announcement.model';

@Injectable({ providedIn: 'root' })
export class FeatureAnnouncementService {
  private http = inject(HttpClient);

  fetch(): Observable<Announcement[]> {
    return this.http
      .get<Announcement[]>('assets/announcements.json')
      .pipe(catchError(() => of([])));
  }
}
