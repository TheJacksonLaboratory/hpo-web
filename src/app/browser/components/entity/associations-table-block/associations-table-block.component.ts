import { Component, ContentChild, HostBinding, Input, TemplateRef, ViewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

/** One entry in an associations table's "Sort by" dropdown. */
export interface SortOption {
  /** Text shown in the dropdown, e.g. `Disease Name (A-Z)`. */
  label: string;
  /** Row property to sort on. */
  field: string;
  /** Sort direction: `1` ascending, `-1` descending. */
  order: 1 | -1;
}

/**
 * One anchored association section: a heading carrying the row count, optional
 * sort and filter controls, and a paginated table.
 *
 * Replaces the per-column `applyXFilter` methods and hand-wired
 * sort/paginator/filter setup that each of the three legacy entity pages
 * repeated - see `docs/adr/0001-HPO-68-unified-entity-page.md`.
 *
 * Columns are content-projected rather than configured, so each page declares
 * its own cells and keeps full control of their markup. Callers must provide
 * both templates whenever the section can actually render rows; a section that
 * is always empty (no backing field yet) may omit them, since only the heading
 * and empty state render:
 *
 * - `#headerCells` - the `<th>` elements for one header row.
 * - `#rowCells` - the `<td>` elements for one body row. The row is passed as
 *   the implicit context, so `let-row` binds it.
 *
 * The surrounding `<tr>` is supplied by this component; projecting one would
 * nest it.
 *
 * Projected cells must not use PrimeNG directives that inject `Table`
 * (`pSortableColumn`, `p-sortIcon`): the template is declared in the caller,
 * where `Table` is not an ancestor, so they throw `NG0201` and the header row
 * silently renders empty. Sorting is offered through {@link sortOptions}.
 *
 * @example
 * ```html
 * <app-associations-table-block
 *   anchorId="gene-associations"
 *   title="Gene Associations"
 *   [value]="viewModel.geneAssoc"
 *   [networkError]="viewModel.networkError"
 *   [globalFilterFields]="['id', 'name']"
 *   [sortOptions]="geneSortOptions"
 *   [emptyCtaLink]="contributeLinks.gene"
 * >
 *   <ng-template #headerCells>
 *     <th>Gene Id</th>
 *   </ng-template>
 *   <ng-template #rowCells let-row>
 *     <td>{{ row.id }}</td>
 *   </ng-template>
 * </app-associations-table-block>
 * ```
 */
@Component({
  selector: 'app-associations-table-block',
  standalone: true,
  imports: [NgTemplateOutlet, FormsModule, TableModule, PrimeTemplate, IconField, InputIcon, InputText, Select, Skeleton, EmptyStateComponent],
  templateUrl: './associations-table-block.component.html',
})
export class AssociationsTableBlockComponent {
  /**
   * DOM id for this section, used as the scroll target by the "On this page"
   * panel menu. Must match the `anchor` of the corresponding
   * {@link PanelMenuItem}.
   */
  @Input() anchorId: string;

  /** Section heading, e.g. `Disease Associations`. */
  @Input() title: string;

  /**
   * Optional explanatory sentence shown under the heading, for anything the
   * label alone cannot carry - how a set is derived, what it excludes, where
   * it comes from. Keeps qualifiers out of the label, which also has to read
   * well in the "On this page" panel.
   */
  @Input() description?: string;

  /** Rows to render. An empty array shows the empty state instead of the table. */
  @Input() value: unknown[] = [];

  /** Shows a skeleton in place of the table while the rows are being fetched. */
  @Input() loading = false;

  /**
   * Replaces the table with an annotation-network error block. Set when the
   * entity resolved but its annotations did not, so the rest of the page can
   * still render.
   */
  @Input() networkError = false;

  /** Whether to offer the free-text filter box. */
  @Input() filterable = true;

  /** Whether to paginate. Off shows every row at once. */
  @Input() paginated = true;

  /** Row properties the filter box searches. Required for filtering to do anything. */
  @Input() globalFilterFields: string[] = [];

  /**
   * Where the empty state's "contribute" call to action points. Required for
   * the empty state to render a link at all, since each association type is
   * curated through a different channel.
   */
  @Input() emptyCtaLink?: string;

  /** Options for the "Sort by" dropdown (Figma: Left Inputs / select). Omit to hide it. */
  @Input() sortOptions?: SortOption[];

  /**
   * Sinks a section with no rows to the bottom of the page, so the reader meets
   * everything that has content first. Relies on the parent being a flex
   * column; `order` leaves DOM order untouched, and flex keeps same-order
   * siblings in source order, so the empty ones stay in their canonical
   * sequence relative to each other.
   *
   * `buildSections` applies the same rule to the panel menu, keyed off the same
   * emptiness, so the two orders always agree.
   */
  @HostBinding('class.order-last')
  get sinksToBottom(): boolean {
    return !this.value.length;
  }

  /** Projected `<th>` cells for the header row. See the class example. */
  @ContentChild('headerCells', { read: TemplateRef }) headerCellsTpl: TemplateRef<unknown>;

  /** Projected `<td>` cells for a body row, with the row as implicit context. */
  @ContentChild('rowCells', { read: TemplateRef }) rowCellsTpl: TemplateRef<unknown>;

  /** The underlying PrimeNG table, used to drive global filtering. */
  @ViewChild('dt') table: Table;

  /** Currently chosen sort option, or undefined while the table is unsorted. */
  selectedSort?: SortOption;

  /** Row property the table is sorted on, mirrored from {@link selectedSort}. */
  sortField?: string;

  /** Sort direction the table is sorted in, mirrored from {@link selectedSort}. */
  sortOrder: 1 | -1 = 1;

  /**
   * Applies the filter box's text as a "contains" match across
   * {@link globalFilterFields}.
   *
   * @param value Current contents of the filter input.
   */
  onFilterInput(value: string): void {
    this.table?.filterGlobal(value, 'contains');
  }

  /** Pushes the chosen {@link selectedSort} into the table's sort bindings. */
  onSortChange(): void {
    this.sortField = this.selectedSort?.field;
    this.sortOrder = this.selectedSort?.order ?? 1;
  }
}
