import { Component, DestroyRef, Input, inject } from '@angular/core';
import { CdkCopyToClipboard, Clipboard } from '@angular/cdk/clipboard';
import { ClinicalClipboardService } from '../../../services/clinical-clipboard/clinical-clipboard.service';

/**
 * How long the "copied" confirmation stays on screen. Long enough to notice,
 * short enough that the chip is back to its resting state before a second copy.
 */
const COPIED_FEEDBACK_MS = 1500;

/**
 * A pill showing an ontology identifier, which can act as a
 * copy-to-clipboard button or as a link to the identifier's source.
 *
 * Deliberately not built on PrimeNG's `p-tag`: every one of its colour tokens
 * had to be overridden with `!important` to match the design, and a tag cannot
 * be a button, so the copy affordance ended up as a nested control covering
 * only part of the chip. A plain element carrying {@link chipClasses} is the
 * same box with none of that.
 */
@Component({
  selector: 'app-id-badge',
  standalone: true,
  imports: [CdkCopyToClipboard],
  templateUrl: './id-badge.component.html',
})
export class IdBadgeComponent {
  /** The identifier to display, e.g. `HP:0001250`. */
  @Input() id: string;

  /**
   * Turns the whole chip into a button that copies {@link id} to the
   * clipboard. Mutually exclusive with {@link externalUrl} - a chip cannot be
   * both a button and a link without nesting interactive elements - and takes
   * precedence if both are set.
   */
  @Input() copyable = false;

  /** When set, the badge links out to the identifier's canonical page. */
  @Input() externalUrl?: string;

  /**
   * With {@link copyable}, makes the chip a toggle for the Clinical Clipboard: a click
   * copies {@link id} and adds the term to the list, and a click on a term
   * already in the list removes it.
   */
  @Input() collect = false;

  /** The term name stored in the Clinical Clipboard. Falls back to {@link id}. */
  @Input() name?: string;

  /**
   * Text shown in place of the id for a moment after a Clinical Clipboard toggle,
   * or undefined when the id is shown.
   */
  collectFeedback?: string;

  readonly clinicalClipboard = inject(ClinicalClipboardService);

  private readonly clipboard = inject(Clipboard);

  /**
   * True for a moment after a successful copy, which swaps the icon to a tick.
   * Without it the chip looks inert on click, since copying is silent.
   */
  copied = false;

  private resetTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.resetTimer));
  }

  /**
   * Shows the confirmation, then clears it. Re-copying restarts the timer
   * rather than letting an earlier one cut the new confirmation short.
   *
   * @param success Whether the clipboard write actually succeeded.
   */
  onCopied(success: boolean): void {
    if (!success) {
      return;
    }
    this.copied = true;
    clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => (this.copied = false), COPIED_FEEDBACK_MS);
  }

  /**
   * Toggles the term in the Clinical Clipboard. Adding also copies {@link id} to the
   * clipboard; removing does not. The chip then shows what happened for
   * {@link COPIED_FEEDBACK_MS}.
   */
  onCollectClick(): void {
    const added = this.clinicalClipboard.toggle({ id: this.id, name: this.name || this.id });
    if (added) {
      this.clipboard.copy(this.id);
    }
    this.collectFeedback = added ? 'Copied to Clipboard' : 'Removed from Clipboard';
    clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => (this.collectFeedback = undefined), COPIED_FEEDBACK_MS);
  }
}
