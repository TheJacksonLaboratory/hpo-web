import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { EntityType, Language, PanelMenuItem } from '../../models/models';
import { EntityDataResolverService } from './entity-data.resolvers';
import { EntityPageViewModel } from './entity-page.types';
import { buildSections } from './entity-page.sections';
import { TermPageContentComponent } from './content/term-page-content.component';
import { HierarchyTreeComponent } from '../../components/entity/hierarchy-tree/hierarchy-tree.component';
import { OnThisPagePanelMenuComponent } from '../../components/entity/on-this-page-panel-menu/on-this-page-panel-menu.component';
import { ExportAssociationsButtonComponent } from '../../components/entity/export-associations-button/export-associations-button.component';
import { ReportEntryIssueButtonComponent } from '../../components/entity/report-entry-issue-button/report-entry-issue-button.component';
import { SessionPlaceholderComponent } from '../../components/session/session-placeholder.component';
import { LanguageService } from '../../services/language/language.service';

/**
 * The single routed component behind the phenotype, gene, and disease detail
 * pages. All three routes point here and are told apart by the route's
 * `data.entityType`, so the three pages share one shell instead of being three
 * near-duplicate components - see `docs/adr/0001-HPO-68-unified-entity-page.md`.
 *
 * The shell owns everything that is the same for every entity type: the page
 * grid, and the sticky right rail holding the "On this page" panel menu, the
 * download button and the report-issue button. What differs per type is the
 * content component rendered in the middle column and the optional left rail
 * beside it.
 */
@Component({
  selector: 'app-entity-page',
  standalone: true,
  imports: [
    TermPageContentComponent,
    HierarchyTreeComponent,
    OnThisPagePanelMenuComponent,
    ExportAssociationsButtonComponent,
    ReportEntryIssueButtonComponent,
    SessionPlaceholderComponent,
  ],
  templateUrl: './entity-page.component.html',
})
export class EntityPageComponent implements OnInit {
  /** Exposes the enum to the template so it can narrow on `viewModel.kind`. */
  readonly EntityType = EntityType;

  /** Which entity page this is, from the route's `data.entityType`. */
  entityType: EntityType;

  /** The resolved page data, or null while loading or after a failure. */
  viewModel: EntityPageViewModel | null = null;

  /** "On this page" items for the current view model, rebuilt on each resolve. */
  sections: PanelMenuItem[] = [];

  /** True while a resolve is in flight, including on in-page navigation to another entity. */
  loading = true;

  /**
   * Language the page renders in. Owned here rather than in the content
   * component because the left rail and the content column both translate
   * against it.
   */
  selectedLanguage: Language = this.languageService.default;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resolverService: EntityDataResolverService,
    private languageService: LanguageService,
  ) {
    this.languageService.active$.subscribe((active) => this.onActiveLanguageChange(active));
  }

  /**
   * Resolves the entity on entry and on every subsequent id change, so
   * navigating between two terms re-fetches instead of leaving stale data on
   * screen. Failures route to the error page - by this point the entity does
   * not exist or has no resolver, so there is nothing partial worth rendering.
   */
  ngOnInit(): void {
    this.entityType = this.route.snapshot.data['entityType'];

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.loading = true;
          this.viewModel = null;
          this.sections = [];
          return this.resolverService.resolve(this.entityType, params.get('id'));
        }),
      )
      .subscribe({
        next: (viewModel) => {
          this.viewModel = viewModel;
          this.sections = buildSections(viewModel);
          this.loading = false;
          // Re-check after the swap: the entity just navigated to may not have
          // a translation for the language the previous one was showing.
          this.onActiveLanguageChange(this.languageService.languageSubject.value);
        },
        error: (error) => {
          this.loading = false;
          this.router.navigate(['/error'], {
            state: { description: error?.message ?? 'Could not find the requested page.' },
          });
        },
      });
  }

  /**
   * Falls back to the default language when the app-wide active language is one
   * the current entity has no translation for, so navigating from a translated
   * term to an untranslated one does not leave the selector on a dead option.
   */
  private onActiveLanguageChange(active: Language): void {
    const available = this.viewModel && 'languages' in this.viewModel ? this.viewModel.languages : [];
    const exists = available.some((language) => language.language === active.language);
    this.selectedLanguage = exists ? active : this.languageService.default;
  }
}
