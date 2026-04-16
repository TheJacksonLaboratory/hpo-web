import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AnnouncementBannerComponent } from './announcement-banner.component';
import { AnnouncementService } from './announcement.service';
import { Announcement } from './announcement.model';

describe('AnnouncementBannerComponent', () => {
  const storageKey = 'dismissed-announcements';

  const feature: Announcement = {
    id: 'feat-1',
    type: 'feature',
    title: 'Feature',
    body: 'feature body',
  };
  const release: Announcement = {
    id: 'release-v1',
    type: 'release',
    title: 'Release',
    body: 'release body',
    dismissTtlDays: 365,
  };

  let fixture: ComponentFixture<AnnouncementBannerComponent>;
  let component: AnnouncementBannerComponent;

  const setup = (items: Announcement[]) => {
    TestBed.configureTestingModule({
      imports: [AnnouncementBannerComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        {
          provide: AnnouncementService,
          useValue: { getAnnouncements: () => of(items) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnnouncementBannerComponent);
    component = fixture.componentInstance;
  };

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('loads announcements that have not been dismissed', () => {
    setup([feature, release]);
    fixture.detectChanges();
    expect(component.announcements()).toEqual([feature, release]);
  });

  it('hides announcements whose dismissal is still valid', () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify([{ id: 'feat-1', expiry: Date.now() + 1_000_000 }])
    );
    setup([feature, release]);
    fixture.detectChanges();
    expect(component.announcements()).toEqual([release]);
  });

  it('prunes expired dismissal entries on init', () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify([
        { id: 'feat-1', expiry: Date.now() - 1_000 },
        { id: 'release-v1', expiry: Date.now() + 1_000_000 },
      ])
    );
    setup([feature, release]);
    fixture.detectChanges();

    const stored = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('release-v1');
    expect(component.announcements()).toEqual([feature]);
  });

  it('dismiss() writes the id with the default 30-day TTL', () => {
    setup([feature]);
    fixture.detectChanges();

    const before = Date.now();
    component.dismiss('feat-1');
    const after = Date.now();

    const stored = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('feat-1');
    expect(stored[0].expiry).toBeGreaterThanOrEqual(before + 30 * 86_400_000);
    expect(stored[0].expiry).toBeLessThanOrEqual(after + 30 * 86_400_000);
    expect(component.announcements()).toEqual([]);
  });

  it('dismiss() honors the per-announcement dismissTtlDays for releases', () => {
    setup([release]);
    fixture.detectChanges();

    const before = Date.now();
    component.dismiss('release-v1');
    const after = Date.now();

    const stored = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    expect(stored[0].expiry).toBeGreaterThanOrEqual(before + 365 * 86_400_000);
    expect(stored[0].expiry).toBeLessThanOrEqual(after + 365 * 86_400_000);
  });

  it('severityIcon() maps every severity and falls back to info', () => {
    setup([]);
    fixture.detectChanges();
    expect(component.severityIcon('info')).toBe('pi pi-info-circle');
    expect(component.severityIcon('success')).toBe('pi pi-check-circle');
    expect(component.severityIcon('warn')).toBe('pi pi-exclamation-triangle');
    expect(component.severityIcon('error')).toBe('pi pi-times-circle');
    expect(component.severityIcon(undefined)).toBe('pi pi-info-circle');
  });

  it('dismissAll() writes every announcement id to storage and clears the list', () => {
    setup([feature, release]);
    fixture.detectChanges();
    expect(component.announcements()).toHaveLength(2);

    component.dismissAll();

    const stored = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    expect(stored).toHaveLength(2);
    expect(stored.map((e: { id: string }) => e.id)).toEqual([
      'feat-1',
      'release-v1',
    ]);
    expect(component.announcements()).toEqual([]);
  });

  it('dismissAll() respects per-announcement TTL for each entry', () => {
    setup([feature, release]);
    fixture.detectChanges();

    const before = Date.now();
    component.dismissAll();
    const after = Date.now();

    const stored = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    const featEntry = stored.find((e: { id: string }) => e.id === 'feat-1');
    const releaseEntry = stored.find(
      (e: { id: string }) => e.id === 'release-v1'
    );

    // feature uses default 30-day TTL
    expect(featEntry.expiry).toBeGreaterThanOrEqual(before + 30 * 86_400_000);
    expect(featEntry.expiry).toBeLessThanOrEqual(after + 30 * 86_400_000);

    // release uses its own 365-day TTL
    expect(releaseEntry.expiry).toBeGreaterThanOrEqual(
      before + 365 * 86_400_000
    );
    expect(releaseEntry.expiry).toBeLessThanOrEqual(
      after + 365 * 86_400_000
    );
  });
});
