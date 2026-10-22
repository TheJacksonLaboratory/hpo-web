import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  afterRenderEffect,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { EntityType } from '../../models/models';
import { SessionHistoryService } from '../../services/session-history/session-history.service';
import { IndexedStep, SessionStep } from '../../services/session-history/session-history.types';
import { layoutRow, stepRoute } from '../../services/session-history/session-history.trail';

/** PrimeIcons class for each entity type's step icon. */
const TYPE_ICON: Record<EntityType, string> = {
  [EntityType.PHENOTYPE]: 'pi-bullseye',
  [EntityType.DISEASE]: 'pi-wave-pulse',
  [EntityType.GENE]: 'pi-share-alt',
};

/** Accessible name of each kind of "..." menu button. */
const MENU_LABEL = {
  before: 'Show earlier steps',
  gap: 'Show skipped steps',
  after: 'Show later steps',
};

/** Widths measured from the invisible row, in pixels. */
interface Measurements {
  /** Rendered width of each step, one per step in the trail. */
  widths: number[];
  /** Width of the row the steps must fit in. */
  available: number;
  /** Width of a "..." button. */
  overflowWidth: number;
  /** Space between adjacent items. */
  gap: number;
}

/**
 * The "Session History" breadcrumb: the entity pages visited in this tab, in
 * order, each linking back to its page, with the page on screen shown as plain
 * text.
 *
 * The row never wraps. It shows the current step and as many neighbours as fit;
 * steps that do not fit, and steps left behind by a branch, collapse behind
 * "..." buttons that open a menu listing them. Choosing a step, from the row or
 * a menu, goes to it through {@link SessionHistoryService.goTo} without
 * removing any step. "Clear history" empties the trail down to the current step.
 */
@Component({
  selector: 'app-session-history',
  standalone: true,
  imports: [Menu],
  templateUrl: './session-history.component.html',
})
export class SessionHistoryComponent {
  private readonly history = inject(SessionHistoryService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly nav = viewChild.required<ElementRef<HTMLElement>>('nav');
  private readonly measureRow = viewChild<ElementRef<HTMLElement>>('measureRow');

  /** The trail being shown. */
  readonly trail = this.history.trail;

  /** Latest measurements, or null before the first one. */
  private readonly measurements = signal<Measurements | null>(null);

  /** What the row shows; everything until the first measurement. */
  readonly items = computed(() => {
    const trail = this.trail();
    const measured = this.measurements();
    return measured
      ? layoutRow(trail, measured.widths, measured.available, measured.overflowWidth, measured.gap)
      : layoutRow(trail, trail.steps.map(() => 0), Infinity, 0, 0);
  });

  /** Entries of the menu that is open, or was last opened. */
  readonly menuItems = signal<MenuItem[]>([]);

  constructor() {
    afterRenderEffect({
      read: () => {
        this.trail();
        this.measure();
      },
    });
    afterNextRender(() => {
      const row = this.measureRow()?.nativeElement;
      if (typeof ResizeObserver === 'undefined' || !row) {
        return;
      }
      const observer = new ResizeObserver(() => this.measure());
      observer.observe(this.nav().nativeElement);
      observer.observe(row);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  /**
   * PrimeIcons classes for a step's type icon.
   *
   * @param step The step to show.
   */
  iconClass(step: SessionStep): string {
    return `pi ${TYPE_ICON[step.entityType]}`;
  }

  /**
   * Accessible name of a "..." menu button.
   *
   * @param kind Which kind of hidden steps the button opens.
   */
  menuLabel(kind: 'before' | 'gap' | 'after'): string {
    return MENU_LABEL[kind];
  }

  /**
   * URL of a step's page, used as the link target.
   *
   * @param step The step to link to.
   */
  href(step: SessionStep): string {
    return this.router.serializeUrl(this.router.createUrlTree(stepRoute(step)));
  }

  /**
   * Goes to a clicked step. Modified clicks (new tab, new window) are left to
   * the browser.
   *
   * @param event The click event.
   * @param index Index of the clicked step in the trail.
   */
  onStepClick(event: MouseEvent, index: number): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    this.history.goTo(index);
  }

  /**
   * Opens a "..." menu listing hidden steps.
   *
   * @param event The click event that opens it.
   * @param menu The menu to open.
   * @param hidden The steps to list.
   */
  openMenu(event: Event, menu: Menu, hidden: IndexedStep[]): void {
    this.menuItems.set(
      hidden.map(({ step, index }) => ({
        label: step.label,
        icon: this.iconClass(step),
        command: () => this.history.goTo(index),
      })),
    );
    menu.toggle(event);
  }

  /** Empties the trail down to the page on screen. */
  clear(): void {
    this.history.clear();
  }

  /** Measures the invisible row against the available width. */
  private measure(): void {
    const row = this.measureRow()?.nativeElement;
    if (!row) {
      return;
    }
    const nav = this.nav().nativeElement;
    const style = getComputedStyle(nav);
    this.measurements.set({
      widths: Array.from(row.querySelectorAll<HTMLElement>('li[data-step]')).map((item) => item.offsetWidth),
      available: nav.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0),
      overflowWidth: row.querySelector<HTMLElement>('li[data-overflow]')?.offsetWidth ?? 0,
      gap: parseFloat(getComputedStyle(row).columnGap) || 0,
    });
  }
}
