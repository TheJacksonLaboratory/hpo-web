import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Message } from 'primeng/message';
import { AnnouncementService } from './announcement.service';
import { Announcement } from './announcement.model';

interface DismissedEntry {
  id: string;
  expiry: number;
}

@Component({
  selector: 'app-announcement-banner',
  standalone: true,
  imports: [Message, RouterLink],
  templateUrl: './announcement-banner.component.html',
  styleUrl: './announcement-banner.component.scss',
})
export class AnnouncementBannerComponent implements OnInit {
  announcements = signal<Announcement[]>([]);

  private readonly storageKey = 'dismissed-announcements';
  private readonly ttlDays = 30;

  constructor(private announcementService: AnnouncementService) {}

  ngOnInit() {
    this.pruneExpired();
    this.announcementService.getAnnouncements().subscribe((items) => {
      const dismissedIds = this.getDismissed().map((e) => e.id);
      this.announcements.set(
        items.filter((item) => !dismissedIds.includes(item.id))
      );
    });
  }

  severityIcon(severity?: string): string {
    const icons: Record<string, string> = {
      info: 'pi pi-info-circle',
      success: 'pi pi-check-circle',
      warn: 'pi pi-exclamation-triangle',
      error: 'pi pi-times-circle',
    };
    return icons[severity ?? 'info'] ?? icons['info'];
  }

  dismiss(id: string) {
    const announcement = this.announcements().find((a) => a.id === id);
    const ttl = (announcement?.dismissTtlDays ?? this.ttlDays) * 86_400_000;
    const entries = this.getDismissed();
    entries.push({ id, expiry: Date.now() + ttl });
    localStorage.setItem(this.storageKey, JSON.stringify(entries));
    this.announcements.update((items) =>
      items.filter((item) => item.id !== id)
    );
  }

  dismissAll() {
    const entries = this.getDismissed();
    for (const announcement of this.announcements()) {
      const ttl =
        (announcement.dismissTtlDays ?? this.ttlDays) * 86_400_000;
      entries.push({ id: announcement.id, expiry: Date.now() + ttl });
    }
    localStorage.setItem(this.storageKey, JSON.stringify(entries));
    this.announcements.set([]);
  }

  private getDismissed(): DismissedEntry[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  private pruneExpired() {
    const entries = this.getDismissed().filter((e) => e.expiry > Date.now());
    localStorage.setItem(this.storageKey, JSON.stringify(entries));
  }
}
