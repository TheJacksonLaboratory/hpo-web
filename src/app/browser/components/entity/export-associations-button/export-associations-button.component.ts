import { Component, Input } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { DialogService } from '../../../../shared/dialog-excel-download/dialog.service';

/**
 * Opens the shared download dialog for the current entity's associations.
 *
 * Replaces the identical `downloadDialog()` wiring and button markup that each
 * of the three legacy entity pages carried its own copy of.
 */
@Component({
  selector: 'app-export-associations-button',
  standalone: true,
  imports: [ButtonDirective],
  templateUrl: './export-associations-button.component.html',
})
export class ExportAssociationsButtonComponent {
  /** Entity id whose associations the dialog will export. */
  @Input() id: string;

  /**
   * Row count per downloadable association set, keyed by the name the dialog
   * expects (`diseases`, `genes`, ...). Drives both what the dialog offers and
   * whether the button is enabled.
   */
  @Input() counts: Record<string, number> = {};

  constructor(private dialogService: DialogService) {}

  /** True when there is nothing to export, i.e. every count is zero. */
  get disabled(): boolean {
    return Object.values(this.counts).every((count) => !count);
  }

  /** Opens the download dialog for {@link id} with the available {@link counts}. */
  openDialog(): void {
    this.dialogService.openDownloadDialog(this.id, this.counts);
  }
}
