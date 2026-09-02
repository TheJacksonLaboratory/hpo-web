import { Component, DestroyRef, Input, inject } from '@angular/core';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';

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
  /**
   * The chip's box, shared by all three variants so a button, a link and a
   * plain pill are always the same size and colour.
   */
  readonly chipClasses =
    'inline-flex items-center gap-2 px-2 py-1 rounded-md whitespace-nowrap ' +
    'border border-[var(--p-content-border-color)] bg-[var(--p-content-background)] ' +
    'text-[var(--p-text-color)] text-sm leading-4 font-bold';

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
}
