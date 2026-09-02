# 0001 — Unified Entity Page (Phenotype / Gene / Disease)

## Status

Accepted (2026-08-31)

## Context

`hpo-web` renders phenotype (term), gene, and disease detail pages as three
independent, near-duplicate Angular components (`pages/term`, `pages/gene`,
`pages/disease`). Each hand-rolls its own Angular Material summary card, tab
group, and `MatTableDataSource` + `MatSort` + `MatPaginator` + manual filter
wiring. Concrete duplication confirmed across all three: identical CSS rules
(`.tab-output-container`, `.filter-header`, `.mat-form-field` sizing),
near-identical `applyXFilter(value)` trim/lowercase methods (one per column,
6+ total), identical `downloadDialog()` → `DialogService.openDownloadDialog`
wiring, identical "Export Associations" button markup, and hardcoded
`routerLink="/browse/{gene|disease|term}/{{row.id}}"` strings repeated
throughout instead of a shared link builder.

The approved Figma redesign (file `YS0wExLoH5cGTYMviEnIjw`) gives all three
entity types the same shape: a header, a stack of association-table sections,
and a sticky right-side "On this page" panel menu that scroll-spies between
sections — replacing today's `mat-tab-group` tabs entirely. Only the data
differs per type. This is Jira **HPO-68** ("Implement Redesigned Content
Views Layout in UI"). Note: HPO-173 (under the separate HPO-66 "Entity
Pages" epic) covers overlapping scope and is deliberately left open,
per `docs/strategy/2026-08-12-redesign-direction.md`, to be reconciled on
the board — not resolved by this ADR.

One caveat discovered while reading the Figma file: the gene and disease
artboards have swapped placeholder content (gene's frame is titled
"Carey-Fineman-Ziter syndrome" with a MONDO tag; disease's shows "CTNS" with
a gene chromosomal-location/synonyms card). This is sample-data
contamination between artboards, not a real design signal — per-type field
differences in this ADR come from the current `.component.ts` files, not
the Figma mock content.

## Decision

**Architecture — one route, one shell component, explicit per-type
rendering underneath.** Not a config-driven rendering engine (a generic
component driven entirely by a per-type config of typed column
definitions), and not three separate routed components duplicating logic
with shared blocks bolted on.

- `browser.routes.ts` keeps its three existing route entries
  (`term/:id`, `gene/:id`, `disease/:id`, same URLs as today) but points
  all three at **one component class**, `EntityPageComponent`, distinguished
  by route `data.entityType` (not a URL segment) — this is what makes it
  genuinely "a single page component that swaps out sections/data" rather
  than three components sharing blocks.
- `EntityPageComponent` is a thin shell: read `entityType`/`id` from the
  route, look up that type's fetch function from a small map
  (`entity-data.resolvers.ts`), hold loading/error state, own the page grid
  and the sticky right rail, and do **one** `@switch` to render the matching
  content component (`TermPageContent` / `GenePageContent` /
  `DiseasePageContent`).
- **Amended 2026-09-02 (implementation):** the switch is on
  `viewModel.kind`, not `entityType`. Each view model extends
  `EntityPageViewModelBase` (`kind`, `id`, `title`, `downloadCounts`), making
  `EntityPageViewModel` a discriminated union the shell reads without casts.
  This is a documentation and dispatch benefit only, not a compile-time
  guarantee: `tsconfig.json` sets neither `strict` nor
  `angularCompilerOptions.strictTemplates`, so neither template narrowing nor
  switch exhaustiveness is enforced today — both verified empirically.
- **Amended 2026-09-02 (implementation):** the shell, not the content
  component, owns the three-column grid, the left rail, and the right rail.
  The first draft put all of it in `TermPageContent`, which would have
  triplicated the scaffold once gene and disease landed. The shell therefore
  also renders term's `HierarchyTreeComponent` and owns the selected language
  (the rail and the content column both translate against it, so one owner
  keeps them in step).
- Each content component owns its own template and its own table columns
  explicitly — no generic column-type engine. A developer reading the
  disease content component sees exactly what disease renders.
- Each entity type's set of association sections is a small declarative
  config array (which sections exist, label, anchor, count). This is what
  "swap out sections" means concretely, and is treated as an intermediate
  step toward a more config-driven approach later, without committing to
  a full rendering engine now.
- **Overridden 2026-09-02 for term's Examples and Publications.** The rule
  below still governs per-type differences (gene omits Medical Actions and
  LOINC; disease omits LOINC), but on the phenotype page **Examples** and
  **Publications** are now rendered as permanently-empty sections showing only
  a contribute call to action, because the approved design carries them and
  their absence read as a gap. This is a deliberate, product-led exception to
  the principle stated next, not an oversight, and it should be revisited once
  Examples has a backing field. **Publications is now populated** (amended
  later the same day): it renders `Term.publicationReferences` as a one-column
  table of linked PMIDs, and the summary's "View Publications" popover button
  was removed so the page has a single place for citations. The ids stand in
  for the title/abstract the design shows, which no current field supplies -
  `PublicationReference` in `entity-page.types.ts` exists so that metadata can
  arrive as extra fields rather than a contract change. Sourcing it is tracked
  as **HPO-200** (under HPO-139, Release Readiness), which decides between
  extending the annotation payload via HPO-169, fetching from NCBI
  E-utilities client-side, or accepting ids only for this release. Examples
  alone remains a permanently-empty section.
- **Missing data is expressed as absence from a type's section config, not
  a permanent fake empty state.** `GeneAssociation{diseases,phenotypes}`
  has no `medicalActions`/`assays` fields at all, so gene's config omits
  Medical Actions and LOINC sections entirely. `DiseaseAssociation{disease,
  categories,genes,medicalActions}` has no `assays` field, so disease's
  config omits LOINC. Disease's `medicalActions` section is real and stays,
  rendering a genuine empty state when a disease happens to have zero.
- Shared building blocks live in `src/app/browser/components/entity/`:
  `AssociationsTableBlockComponent` (PrimeNG `p-table`, replaces the 6
  duplicated filter methods, built-in paginator, loading skeleton,
  network-error block; columns via content-projected `<ng-template>`, not
  a config array), `EmptyStateComponent`, `OnThisPagePanelMenuComponent`
  (new — `IntersectionObserver`-based scroll-spy, no new dependency),
  `HierarchyTreeComponent` (term's real parent/child tree, lifted
  verbatim), `IdBadgeComponent`, `ExportAssociationsButtonComponent`,
  `ReportEntryIssueButtonComponent`.
- **Corrected 2026-09-02:** `ReportEntryIssueButtonComponent` is *not*
  disease-only. Figma node `315:4443` ("right side panelmenu") places it on
  the phenotype rail directly beneath the download button, so it ships with
  the term step. It links to the HPO curation issue tracker with the entity id
  prefilled in the issue title — an implementation assumption, since no
  behaviour for it was specified.
- **Projected table cells must not inject `Table`.** A content-projected
  `<ng-template #headerCells>` is declared in the *caller*, where PrimeNG's
  `Table` is not an ancestor, so `pSortableColumn` and `p-sortIcon` throw
  `NG0201`: the header row renders empty while the body still populates — a
  silent failure. Column sorting is offered through the block's `sortOptions`
  select instead. This is a cost of choosing projection over a column config,
  recorded here so it is not rediscovered.
- **Rollout order: term → gene → disease**, each its own shippable step.
  The shell and shared blocks are built once during the term step, then
  extended (new resolver + content component + section config) for gene
  and disease — not rebuilt. Each step re-points only that type's route to
  the new shell; the other two keep using their existing, unmodified
  legacy components until their own step, so a regression is contained to
  the route just migrated.
- **Verify before finalizing disease's Medical Actions columns:**
  `disease.component.ts` types `medicalActionsDataSource` as
  `MedicalActionSourceExtended` (`relations`, `sources`) but the template
  reads `row.targets`, which doesn't exist on that type — a pre-existing
  type/template mismatch. Check the real `/network/annotation/{diseaseId}`
  response shape during the disease step before writing that section's
  columns.

**Out of scope:** the breadcrumb/"Session History" trail (HPO-43, a
different epic); term's Figma "Examples"/"Publications" sections (no
backing field, screenshot placeholders only in the design); backend DTO
and provenance work (`AnnotationController.all()`, `SupportedEntity`,
HPO-155 — not yet shipped; this work targets the current
`AnnotationService`/`models.ts` shapes only).

## Consequences

- Three page directories (`pages/term`, `pages/gene`, `pages/disease`)
  collapse into one (`pages/entity/`) plus a shared `components/entity/`
  block library, removing the duplicated filter/table/dialog-wiring logic
  called out above.
- Angular Material's table/tabs/form-field stack is dropped from these
  three pages in favor of PrimeNG + Tailwind, matching the direction
  already established by `search-results`/`search-result-card`.
  `@angular/material` itself remains a dependency (the shared download
  dialog still uses `MatDialog`).
- Adding a section to an entity type becomes a section-config change
  rather than a new template branch; adding a genuinely new column layout
  still means writing that column's template in the relevant content
  component, by design — this ADR is not adopting a config-driven column
  engine.
- If HPO-155 (provenance/evidence) or the `AnnotationController.all()`
  DTOs land later, they extend the resolvers/view-models and section
  configs incrementally; this ADR does not block on or design around them.
- Until the gene and disease steps ship, `pages/gene` and `pages/disease`
  remain in place unmodified — this ADR takes effect incrementally, not
  atomically.
- **Spacing and type are held against Figma, in whole Tailwind rem steps.**
  Column geometry is 284 / 874 / 282 with no inter-column gap, and each column
  carries its own vertical padding (sidebar `py-4`, content `p-6`, rail
  `px-6 py-8`) rather than inheriting one from the row. Section gaps live on
  flex parents, never as margins on children. Arbitrary values appear only
  where the scale has no step — the h1's `text-[2.5rem] leading-[3.5rem]`
  (40/56px).
- **One theme bug surfaced while conforming to the design.** In `main.ts` the
  `datatable` override declared `background`/`borderColor`/`color` at the
  component root, where PrimeNG silently ignores them; only `padding` applied,
  so the table header rendered `#f7f7f7` instead of Teal/300 `#94e1dc`. Colour
  tokens must sit under `colorScheme.light`, as the `menubar` and `message`
  overrides in the same file already do.
- **`--p-text-muted-color` (#636363) is correct and must not be repointed.**
  It matches the design's `card/subtitle/color`. The disabled panel-menu item
  wants the design's `inputtext/disabled/color` (#808080) — a distinct token,
  not a misalignment of the muted one.
- **Three further theme values were realigned to Figma** (2026-09-02), each
  app-wide rather than entity-page-only: `formField.disabledColor` #636363 →
  #808080 (`inputtext/disabled/color`), and the outlined-button border and
  label colours for primary (→ #0177b2) and warn (→ #bc4702), which the preset
  had tinted so far that the controls read as disabled. Like the `datatable`
  fix, these sit under `colorScheme.light`.
- **Sections carry an optional `description`**, rendered as a subheader under
  the heading in the design's `card/subtitle/color`. Qualifiers that used to be
  crammed into a label - "[Inferred]" on gene associations - become a sentence
  that can actually explain itself, and labels stay short enough to read well
  in the "On this page" panel. This supersedes the block's unused
  `groupHeading` input. Description copy makes claims about how data is
  derived, so it needs curator review rather than developer authorship.
- Empty association sections show only the contribute call to action, with no
  "nothing found" copy: the heading already reports `(0)`. The per-type
  contribution links are placeholders pending real targets.
- Canonical section order follows Figma `315:4443` — Summary, Examples,
  Disease Associations, Gene Associations, Medical Actions, LOINC
  Associations, Publications — but **empty sections sink below populated
  ones**, keeping canonical order within each group. Two mechanisms implement
  this off the same emptiness test, so panel and page cannot disagree:
  `buildTermPageSections` partitions the panel items, and
  `AssociationsTableBlockComponent` host-binds `order-last` on itself.
  **Known trade-off:** `order` is visual only, so DOM order still follows the
  template. A keyboard or screen-reader user meets an empty section's
  contribute link in its canonical position rather than its visual one
  (WCAG 1.3.2 / 2.4.3). Fixing that means rendering the sections from an
  ordered config with `@for` instead of writing them out explicitly, which
  this ADR otherwise avoids; deferred rather than decided.
