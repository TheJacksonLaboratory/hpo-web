import { Component, Input, NgZone, afterNextRender, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { PanelMenuItem } from '../../../models/models';

/**
 * Distance below the viewport top at which a section hands over to the next,
 * in pixels. Matches the `gap-8` between association sections in
 * `term-page-content.component.html`, so a section yields as its bottom edge
 * clears the gap above the next one rather than at an arbitrary line.
 *
 * A section shorter than this can never be named by scrolling, which no
 * section is - the shortest is an empty state at 136px.
 */
const SECTION_GAP_PX = 32;

/** How often to re-check the scroll position, in milliseconds. */
const SCROLL_THROTTLE_MS = 100;

/** Scroll movement, in pixels, that counts as the reader having scrolled. */
const SCROLL_RELEASE_PX = 1;

/**
 * The sticky "On this page" navigator: one button per page section, which
 * scrolls to that section and highlights whichever section is currently in
 * view.
 *
 * Replaces the `mat-tab-group` the three legacy entity pages used - sections
 * are now all on one scrolling page rather than behind tabs.
 */
@Component({
  selector: 'app-on-this-page-panel-menu',
  standalone: true,
  imports: [NgClass],
  templateUrl: './on-this-page-panel-menu.component.html',
})
export class OnThisPagePanelMenuComponent {
  /**
   * Sections to list, in page order. Each item's `anchor` must be the DOM id of
   * that section. Every entry is navigable, including a section with no rows -
   * its `count` of zero is what marks it as empty.
   */
  @Input() items: PanelMenuItem[] = [];

  /** Anchor of the section currently highlighted, or null before the first check. */
  activeAnchor: string | null = null;

  /**
   * The section last clicked and the scroll offset that click landed on, held
   * until the reader scrolls away from it. The jump is synchronous, so the
   * offset recorded in {@link scrollTo} is where the page came to rest.
   */
  private clicked?: { anchor: string; scrollY: number };

  /**
   * `ScrollDispatcher` listens outside Angular's zone, so writing
   * {@link activeAnchor} from its callback schedules no change detection on its
   * own. Clicking always worked because a click handler is already in the zone;
   * scrolling was not.
   */
  private readonly zone = inject(NgZone);

  /**
   * Runs the first check after render - the sections are siblings rendered by
   * the page around this component, so they are not in the DOM before then -
   * and re-checks on every throttled scroll thereafter.
   */
  constructor() {
    afterNextRender(() => this.refresh());

    inject(ScrollDispatcher)
      .scrolled(SCROLL_THROTTLE_MS)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.refresh());
  }

  /**
   * Jumps to a section and marks it active immediately, so the highlight
   * responds to the click rather than waiting for the next scroll sample.
   *
   * Deliberately not `behavior: 'smooth'`: that form of `scrollIntoView` moves
   * the page zero pixels in this app, measured as forty consecutive samples at
   * scroll offset 0, while `window.scrollTo` with the same option works - most
   * likely the `html, body { height: 100% }` in `styles.scss`. Jumping also
   * means no animation for the scroll listener to sample part-way through, so
   * the highlight cannot walk through the sections in between.
   *
   * @param item The section to scroll to.
   */
  scrollTo(item: PanelMenuItem): void {
    this.activeAnchor = item.anchor;
    document.getElementById(item.anchor)?.scrollIntoView({ block: 'start' });
    this.clicked = { anchor: item.anchor, scrollY: window.scrollY };
  }

  /**
   * Re-checks the scroll position, entering the zone only when it changed.
   *
   * A click holds its own section until the reader scrolls away from where the
   * jump landed. Without that, clicking a section the page cannot bring to the
   * top - the last screenful, where the scroll clamps - would leave the
   * section above it marked, because that is the one covering the activation
   * offset.
   */
  private refresh(): void {
    if (this.clicked && Math.abs(window.scrollY - this.clicked.scrollY) <= SCROLL_RELEASE_PX) {
      return;
    }
    this.clicked = undefined;

    const next = this.computeActive();
    if (next !== this.activeAnchor) {
      this.zone.run(() => (this.activeAnchor = next));
    }
  }

  /**
   * The first section that has not yet scrolled past {@link SECTION_GAP_PX} -
   * the one the reader is in, or the one they are about to reach when that
   * point falls in the gap between two sections.
   *
   * Each section is judged by its bottom edge rather than its top, so a section
   * shorter than the offset is still reachable. {@link items} is trusted to be
   * in page order, which `docs/adr/0002-HPO-68-empty-section-position.md` makes
   * a property of the template rather than of the data.
   *
   * A section the page cannot scroll to the top - the last one, once the scroll
   * clamps - is simply never named by scrolling. Reaching it is what clicking
   * is for; see {@link scrollTo}.
   */
  private computeActive(): string | null {
    const sections = this.items
      .map((item) => ({ anchor: item.anchor, el: document.getElementById(item.anchor) }))
      .filter((entry): entry is { anchor: string; el: HTMLElement } => entry.el !== null);

    const last = sections.at(-1);
    if (!last) {
      return null;
    }

    const current = sections.find((entry) => entry.el.getBoundingClientRect().bottom > SECTION_GAP_PX);
    return (current ?? last).anchor;
  }
}
