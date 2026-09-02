import { Component, Input, NgZone, afterNextRender, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { PanelMenuItem } from '../../../models/models';

/** Fraction of the viewport height at which a section becomes the active one. */
const ACTIVATION_LINE = 0.3;

/** How often to re-check the scroll position, in milliseconds. */
const SCROLL_THROTTLE_MS = 100;

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
  imports: [],
  templateUrl: './on-this-page-panel-menu.component.html',
})
export class OnThisPagePanelMenuComponent {
  /**
   * Sections to list, in page order. Each item's `anchor` must be the DOM id of
   * that section. Items marked `disabled` are rendered but inert - that is how
   * an empty section is shown as unavailable rather than hidden.
   */
  @Input() items: PanelMenuItem[] = [];

  /** Anchor of the section currently highlighted, or null before the first check. */
  activeAnchor: string | null = null;

  // ScrollDispatcher listens outside Angular's zone, so writing activeAnchor
  // from its callback schedules no change detection on its own. Clicking always
  // worked because a click handler is already in the zone; scrolling was not.
  private readonly zone = inject(NgZone);

  constructor() {
    // Sections are siblings rendered by the page around this component, so they
    // are not in the DOM until after the first render.
    afterNextRender(() => this.refresh());

    inject(ScrollDispatcher)
      .scrolled(SCROLL_THROTTLE_MS)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.refresh());
  }

  /**
   * Classes for one menu button, covering the disabled, active, and default
   * states.
   *
   * @param item The section this button represents.
   * @returns The full class string for the button element.
   */
  itemClasses(item: PanelMenuItem): string {
    // Figma: _panelmenu-item active state is a solid #94e1dc (Teal/300) pill,
    // not a color/weight change on transparent background.
    const base = 'w-full text-left p-2 rounded-md text-base transition-colors';
    if (item.disabled) {
      // Figma uses inputtext/disabled/color here, not the muted text colour -
      // muted (#636363) is the card-subtitle token and reads as active copy.
      return `${base} text-[var(--p-form-field-disabled-color)] cursor-not-allowed`;
    }
    if (this.activeAnchor === item.anchor) {
      return `${base} font-bold text-[#222] bg-[#94e1dc]`;
    }
    return `${base} text-[var(--p-text-color)]`;
  }

  /**
   * Smooth-scrolls to a section and marks it active immediately, so the
   * highlight responds to the click rather than waiting for the scroll to
   * cross the activation line. Disabled items are ignored.
   *
   * @param item The section to scroll to.
   */
  scrollTo(item: PanelMenuItem): void {
    if (item.disabled) {
      return;
    }
    this.activeAnchor = item.anchor;
    document.getElementById(item.anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /** Re-checks the scroll position, entering the zone only when it changed. */
  private refresh(): void {
    const next = this.computeActive();
    if (next !== this.activeAnchor) {
      this.zone.run(() => (this.activeAnchor = next));
    }
  }

  /**
   * The lowest section whose top has passed the activation line - i.e. the one
   * the reader is currently inside. Positions are read fresh and sorted by
   * them, so this does not depend on {@link items} being in visual order.
   *
   * Empty sections are skipped: their disabled styling would win over the
   * active pill anyway, leaving nothing highlighted at all.
   */
  private computeActive(): string | null {
    const line = window.innerHeight * ACTIVATION_LINE;
    const positions = this.items
      .filter((item) => !item.disabled)
      .map((item) => ({ anchor: item.anchor, el: document.getElementById(item.anchor) }))
      .filter((entry): entry is { anchor: string; el: HTMLElement } => entry.el !== null)
      .map((entry) => ({ anchor: entry.anchor, top: entry.el.getBoundingClientRect().top }))
      .sort((a, b) => a.top - b.top);

    const passed = positions.filter((entry) => entry.top <= line);
    return (passed.at(-1) ?? positions.at(0))?.anchor ?? null;
  }
}
