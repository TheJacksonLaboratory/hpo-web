export type AnnouncementType = 'feature' | 'release';

export interface Announcement {
  id: string;
  type: AnnouncementType;
  title: string;
  body: string;
  link?: { label: string; href: string; external?: boolean };
  severity?: 'info' | 'success' | 'warn' | 'error';
  dismissTtlDays?: number;
}
