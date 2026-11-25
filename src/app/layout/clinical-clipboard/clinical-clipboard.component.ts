import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import {
  ClinicalClipboardService,
  ClipboardTerm,
} from '../../browser/services/clinical-clipboard/clinical-clipboard.service';

/** File name of the Clinical Clipboard export. */
const CSV_FILE_NAME = 'clinical-clipboard.csv';

/**
 * Navbar button showing how many terms are on the Clinical Clipboard, and the
 * popover panel it opens to review, remove, clear and export them.
 */
@Component({
  selector: 'app-clinical-clipboard',
  imports: [ButtonModule, PopoverModule],
  templateUrl: './clinical-clipboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative flex items-center' },
})
export class ClinicalClipboardComponent {
  readonly clinicalClipboard = inject(ClinicalClipboardService);

  /** Whether the panel is open. */
  readonly panelOpen = signal(false);

  /** Text for the polite live region announcing panel actions. */
  readonly announcement = signal('');

  private readonly injector = inject(Injector);
  private readonly toggleButton = viewChild.required<ElementRef<HTMLButtonElement>>('toggleButton');

  /** Marks the panel open and moves focus to its heading. */
  onPanelShow(): void {
    this.panelOpen.set(true);
    afterNextRender(() => document.getElementById('clinical-clipboard-title')?.focus(), { injector: this.injector });
  }

  /**
   * Marks the panel closed and, when focus was inside the panel or already
   * lost to `<body>`, returns it to the toggle button.
   */
  onPanelHide(): void {
    this.panelOpen.set(false);
    const active = document.activeElement;
    if (!active || active === document.body || active.closest('[data-clinical-clipboard-panel]')) {
      this.toggleButton().nativeElement.focus();
    }
  }

  /**
   * Removes a term and moves focus to the remove button now in the same row,
   * the last row if the removed term was last, or the toggle button when the
   * list is empty.
   *
   * @param term The term to remove.
   * @param index The term's row in the panel list.
   */
  removeTerm(term: ClipboardTerm, index: number): void {
    this.clinicalClipboard.remove(term.id);
    this.announce(`${term.name} removed`);
    afterNextRender(
      () => {
        const buttons = document.querySelectorAll<HTMLButtonElement>('[data-clinical-clipboard-remove]');
        if (buttons.length) {
          buttons[Math.min(index, buttons.length - 1)].focus();
        } else {
          this.toggleButton().nativeElement.focus();
        }
      },
      { injector: this.injector },
    );
  }

  /** Empties the list and returns focus to the toggle button. */
  clearAll(): void {
    this.clinicalClipboard.clear();
    this.announce('All terms cleared');
    this.toggleButton().nativeElement.focus();
  }

  /** Downloads the list as `clinical-clipboard.csv`. */
  exportCsv(): void {
    const blob = new Blob([this.clinicalClipboard.toCsv()], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = CSV_FILE_NAME;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /**
   * Sets the live region text, clearing it first so a repeated message is
   * announced again.
   *
   * @param message The text to announce.
   */
  private announce(message: string): void {
    this.announcement.set('');
    setTimeout(() => this.announcement.set(message), 30);
  }
}
