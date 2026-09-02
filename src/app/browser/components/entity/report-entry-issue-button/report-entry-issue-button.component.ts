import { Component, Input } from '@angular/core';
import { ButtonDirective } from 'primeng/button';

/** Issue tracker that curates HPO term and annotation content. */
const HPO_ISSUE_TRACKER = 'https://github.com/obophenotype/human-phenotype-ontology/issues/new';

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

  /** Prefilled "new issue" URL for {@link id}. */
  get issueUrl(): string {
    return `${HPO_ISSUE_TRACKER}?title=${encodeURIComponent(`Issue with ${this.id}`)}`;
  }
}
