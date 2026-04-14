export interface Announcement {
  id: string;
  title: string;
  body: string;
  link?: { label: string; href: string };
  severity?: 'info' | 'success' | 'warn' | 'error';
}
