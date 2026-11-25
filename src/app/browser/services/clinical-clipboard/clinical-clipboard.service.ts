import { Injectable, Signal, computed, signal } from '@angular/core';

/** localStorage key holding the serialized list. */
const STORAGE_KEY = 'hpo.clinicalClipboard';

/** A term the user has added to the Clinical Clipboard. */
export interface ClipboardTerm {
  /** The term identifier, e.g. `HP:0000822`. */
  id: string;
  /** The term name as shown when it was copied. */
  name: string;
}

/**
 * Escapes one CSV cell. Prefixes values starting with `=`, `+`, `-` or `@`
 * with an apostrophe, which spreadsheet apps display as text.
 *
 * @param value The raw cell value.
 * @returns The value, quoted when it contains a comma, quote or line break.
 */
function csvCell(value: string): string {
  const text = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/**
 * Holds the terms the user has copied while browsing and keeps them in
 * localStorage so the list survives reloads and new tabs.
 *
 * Term ID badges add and remove entries through {@link toggle}; the navbar's
 * Clinical Clipboard panel reads {@link terms}, removes entries with
 * {@link remove}, empties the list with {@link clear} and exports it with
 * {@link toCsv}.
 */
@Injectable({ providedIn: 'root' })
export class ClinicalClipboardService {
  /** Entries in the order they were added, oldest first. */
  private readonly state = signal<ClipboardTerm[]>(this.load());

  /** The terms on the clipboard, most recently added first. */
  readonly terms: Signal<ClipboardTerm[]> = computed(() => [...this.state()].reverse());

  /** The number of terms on the clipboard. */
  readonly count: Signal<number> = computed(() => this.state().length);

  /**
   * Reports whether a term is in the list.
   *
   * @param id The term identifier.
   * @returns True when the term has been added.
   */
  has(id: string): boolean {
    return this.state().some((term) => term.id === id);
  }

  /**
   * Adds a term to the end of the list. Does nothing if a term with the same
   * id is already there.
   *
   * @param term The term to add.
   * @returns True when the term was added, false when it was already present.
   */
  add(term: ClipboardTerm): boolean {
    if (this.has(term.id)) {
      return false;
    }
    this.commit([...this.state(), { id: term.id, name: term.name }]);
    return true;
  }

  /**
   * Removes a term from the list. Does nothing if it is not there.
   *
   * @param id The identifier of the term to remove.
   */
  remove(id: string): void {
    if (this.has(id)) {
      this.commit(this.state().filter((term) => term.id !== id));
    }
  }

  /**
   * Adds the term if it is absent, otherwise removes it.
   *
   * @param term The term to add or remove.
   * @returns True when the term is in the list afterwards.
   */
  toggle(term: ClipboardTerm): boolean {
    if (this.has(term.id)) {
      this.remove(term.id);
      return false;
    }
    return this.add(term);
  }

  /** Removes every term. */
  clear(): void {
    this.commit([]);
  }

  /**
   * Serializes the list as CSV with a `Term,ID` header row, most recently
   * added first. The text starts with a UTF-8 byte order mark and uses CRLF
   * line endings.
   *
   * @returns The CSV document.
   */
  toCsv(): string {
    const rows = [['Term', 'ID'], ...this.terms().map((term) => [term.name, term.id])];
    return '﻿' + rows.map((row) => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
  }

  /**
   * Replaces the list and writes it to localStorage. A failed write (storage
   * full or blocked) leaves the in-memory list updated.
   *
   * @param terms The new list, oldest first.
   */
  private commit(terms: ClipboardTerm[]): void {
    this.state.set(terms);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(terms));
    } catch {
      // Storage unavailable; the list still works for this page load.
    }
  }

  /**
   * Reads the stored list, dropping malformed and duplicate entries.
   *
   * @returns The stored terms, oldest first, or an empty list when nothing
   * valid is stored.
   */
  private load(): ClipboardTerm[] {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      if (!Array.isArray(parsed)) {
        return [];
      }
      const seen = new Set<string>();
      return parsed.filter((entry): entry is ClipboardTerm => {
        const valid =
          !!entry && typeof entry.id === 'string' && typeof entry.name === 'string' && !seen.has(entry.id);
        if (valid) {
          seen.add(entry.id);
        }
        return valid;
      }).map(({ id, name }) => ({ id, name }));
    } catch {
      return [];
    }
  }
}
