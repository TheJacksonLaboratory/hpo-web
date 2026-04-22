import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Announcement } from './announcement.model';

interface GitHubRelease {
  tag_name: string;
  html_url: string;
}

@Injectable({ providedIn: 'root' })
export class ReleaseAnnouncementService {
  private http = inject(HttpClient);

  private readonly apiUrl =
    'https://api.github.com/repos/obophenotype/human-phenotype-ontology/releases/latest';

  fetch(): Observable<Announcement[]> {
    return this.http.get<GitHubRelease>(this.apiUrl).pipe(
      map((release) => [
        {
          id: `release-${release.tag_name}`,
          type: 'release' as const,
          title: `HPO ${release.tag_name} Released`,
          body: 'A new version of the Human Phenotype Ontology is now available.',
          link: {
            label: 'view release notes',
            href: release.html_url,
            external: true,
          },
          severity: 'info' as const,
          dismissTtlDays: 365,
        },
      ]),
      catchError(() => of([]))
    );
  }
}
