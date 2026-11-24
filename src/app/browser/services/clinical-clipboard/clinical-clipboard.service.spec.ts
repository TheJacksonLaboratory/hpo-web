import { TestBed } from '@angular/core/testing';
import { ClipboardTerm, ClinicalClipboardService } from './clinical-clipboard.service';

const STORAGE_KEY = 'hpo.clinicalClipboard';

const hypertension: ClipboardTerm = { id: 'HP:0000822', name: 'Hypertension' };
const labile: ClipboardTerm = { id: 'HP:6000321', name: 'Labile hypertension' };

describe('ClinicalClipboardService', () => {
  /** Builds the service after optionally seeding the stored list. */
  function create(stored?: unknown): ClinicalClipboardService {
    if (stored !== undefined) {
      localStorage.setItem(STORAGE_KEY, typeof stored === 'string' ? stored : JSON.stringify(stored));
    }
    return TestBed.inject(ClinicalClipboardService);
  }

  const stored = () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');

  beforeEach(() => localStorage.clear());

  it('starts empty', () => {
    const service = create();
    expect(service.terms()).toEqual([]);
    expect(service.count()).toBe(0);
  });

  it('adds terms, newest first, and persists them oldest first', () => {
    const service = create();
    expect(service.add(hypertension)).toBe(true);
    expect(service.add(labile)).toBe(true);

    expect(service.terms()).toEqual([labile, hypertension]);
    expect(service.count()).toBe(2);
    expect(stored()).toEqual([hypertension, labile]);
  });

  it('ignores a duplicate id', () => {
    const service = create();
    service.add(hypertension);
    expect(service.add({ id: hypertension.id, name: 'Other' })).toBe(false);
    expect(service.terms()).toEqual([hypertension]);
  });

  it('removes a term and clears all', () => {
    const service = create([hypertension, labile]);
    service.remove(hypertension.id);
    expect(service.terms()).toEqual([labile]);
    expect(service.has(hypertension.id)).toBe(false);

    service.clear();
    expect(service.terms()).toEqual([]);
    expect(stored()).toEqual([]);
  });

  it('toggles a term in and out', () => {
    const service = create();
    expect(service.toggle(hypertension)).toBe(true);
    expect(service.has(hypertension.id)).toBe(true);
    expect(service.toggle(hypertension)).toBe(false);
    expect(service.has(hypertension.id)).toBe(false);
  });

  it('restores the stored list, dropping malformed and duplicate entries', () => {
    const service = create([hypertension, { id: 5 }, null, { id: hypertension.id, name: 'Dup' }, labile]);
    expect(service.terms()).toEqual([labile, hypertension]);
  });

  it.each(['not json', '{"id":"HP:1"}'])('starts empty when storage holds %p', (raw) => {
    expect(create(raw).terms()).toEqual([]);
  });

  it('keeps working when storage writes fail', () => {
    const service = create();
    const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    expect(service.add(hypertension)).toBe(true);
    expect(service.terms()).toEqual([hypertension]);
    spy.mockRestore();
  });

  describe('toCsv', () => {
    it('writes a BOM, a header and CRLF rows, newest first', () => {
      const service = create([hypertension, labile]);
      expect(service.toCsv()).toBe(
        '﻿Term,ID\r\nLabile hypertension,HP:6000321\r\nHypertension,HP:0000822\r\n',
      );
    });

    it('quotes commas and quotes, and neutralizes formula prefixes', () => {
      const service = create([
        { id: 'HP:1', name: 'A, "b"' },
        { id: 'HP:2', name: '=SUM(A1)' },
      ]);
      expect(service.toCsv()).toBe('﻿Term,ID\r\n\'=SUM(A1),HP:2\r\n"A, ""b""",HP:1\r\n');
    });
  });
});
