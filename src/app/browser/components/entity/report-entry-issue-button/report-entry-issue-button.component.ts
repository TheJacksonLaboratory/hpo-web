import { Component, Input } from '@angular/core';
import { ButtonDirective } from 'primeng/button';

/** Issue tracker that curates HPO term and annotation content. */
const HPO_ISSUE_TRACKER = 'https://github.com/obophenotype/human-phenotype-ontology/issues/new';

/** Contact form for Orphanet, which curates ORPHA entries. */
const ORPHANET_CONTACT = 'https://www.orpha.net/consor/cgi-bin/Directory_Contact.php?lng=EN';

/**
 * Links out to the curation issue tracker so a user can report a problem with
 * the entity currently on screen, with its id prefilled in the issue title.
 *
 * The design places this on the entity page's right rail beneath the download
 * button - see `docs/adr/0001-HPO-68-unified-entity-page.md`.
 */
@Component({
  selector: 'app-report-entry-issue-button',
  standalone: true,
  imports: [ButtonDirective],
  templateUrl: './report-entry-issue-button.component.html',
})
export class ReportEntryIssueButtonComponent {
  /** Entity id to name in the report, e.g. `HP:0001250`. */
  @Input({ required: true }) id: string;

  /**
   * Where to report a problem with {@link id}: Orphanet's contact form for ORPHA
   * entries, otherwise the HPO tracker with the id prefilled in the title.
   */
  get issueUrl(): string {
    if (this.id?.toUpperCase().includes('ORPHA')) {
      return ORPHANET_CONTACT;
    }
    return `${HPO_ISSUE_TRACKER}?title=${encodeURIComponent(`Issue with ${this.id}`)}`;
  }
}
