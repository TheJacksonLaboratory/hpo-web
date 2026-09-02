import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Select } from 'primeng/select';
import { Language, MedicalActionSourceExtended } from '../../../models/models';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { UtilityService } from '../../../../shared/utility/utility.service';
import { LanguageService } from '../../../services/language/language.service';
import { AssociationsTableBlockComponent, SortOption } from '../../../components/entity/associations-table-block/associations-table-block.component';
import { IdBadgeComponent } from '../../../components/entity/id-badge/id-badge.component';
import { TermPageViewModel } from '../entity-page.types';

/**
 * The phenotype page's content column: the term summary followed by its four
 * association sections.
 *
 * Renders the middle column only. The page grid, the hierarchy rail beside it,
 * and the sticky "On this page" aside belong to {@link EntityPageComponent} and
 * are shared with the gene and disease pages.
 *
 * Columns are declared explicitly here rather than generated from a column
 * config, by design - a developer reading this file sees exactly what the
 * phenotype page renders. See `docs/adr/0001-HPO-68-unified-entity-page.md`.
 */
@Component({
  selector: 'app-term-page-content',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ButtonDirective,
    Select,
    TranslatePipe,
    AssociationsTableBlockComponent,
    IdBadgeComponent,
  ],
  templateUrl: './term-page-content.component.html',
})
export class TermPageContentComponent {
  /** The resolved phenotype page data. */
  @Input({ required: true }) viewModel: TermPageViewModel;

  /**
   * Language to render translatable fields in. Owned by
   * {@link EntityPageComponent} so the hierarchy rail and this column always
   * agree; the selector below writes back through {@link LanguageService}.
   */
  @Input({ required: true }) selectedLanguage: Language;

  /**
   * Where each section's "contribute" call to action points when that section
   * is empty. Split per association type because each is curated through its
   * own channel.
   *
   * TODO(HPO-68): placeholders - replace with the real contribution targets
   * for examples, publications, disease, gene, MAxO and LOINC annotations.
   */
  readonly contributeLinks = {
    examples: 'https://www.google.com',
    publications: 'https://www.google.com',
    disease: 'https://www.google.com',
    gene: 'https://www.google.com',
    medicalActions: 'https://www.google.com',
    loinc: 'https://www.google.com',
  };

  /**
   * Explanatory copy shown under a section heading. Lives here so a qualifier
   * like "inferred" can be spelled out in the section without cluttering the
   * label, which also appears in the "On this page" panel.
   *
   * TODO(HPO-68): wording needs a curator's review - it describes how the data
   * is derived, which is a domain claim rather than a UI one.
   */
  readonly sectionDescriptions = {
    disease: 'Diseases curated with this phenotype and this phenotypes children.',
    gene: 'Genes associated with the diseases annotated with this phenotype.',
  };

  /** "Sort by" options offered above the disease associations table. */
  readonly diseaseSortOptions: SortOption[] = [
    { label: 'Disease Name (A-Z)', field: 'name', order: 1 },
    { label: 'Disease Name (Z-A)', field: 'name', order: -1 },
    { label: 'Disease Id (A-Z)', field: 'id', order: 1 },
  ];

  /** "Sort by" options offered above the gene associations table. */
  readonly geneSortOptions: SortOption[] = [
    { label: 'Gene Symbol (A-Z)', field: 'name', order: 1 },
    { label: 'Gene Symbol (Z-A)', field: 'name', order: -1 },
    { label: 'Gene Id (A-Z)', field: 'id', order: 1 },
  ];

  constructor(public utilityService: UtilityService, private languageService: LanguageService) {}

  /**
   * Switches the app-wide display language. The new value arrives back as
   * {@link selectedLanguage} from the parent rather than being set here, so the
   * rail and this column can never disagree.
   *
   * @param language One of the term's available languages.
   */
  changeLanguage(language: Language): void {
    this.languageService.change(language);
  }

  /**
   * Router link to a gene page from a disease row's associated-gene entry,
   * which carries a bare numeric id rather than a prefixed one.
   */
  geneRowLink(gene: { geneId: number }): string[] {
    return ['/browse/gene', String(gene.geneId)];
  }

  /**
   * The PubMed-linkable sources for a medical action. A `sources` list may also
   * hold non-PMID provenance strings, which have no link target.
   */
  medicalActionSources(action: MedicalActionSourceExtended): string[] {
    return action.sources.filter((source) => this.utilityService.isTermIdExpected(source, 'PMID'));
  }
}
