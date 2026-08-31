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
  (`entity-data.resolvers.ts`), hold loading/error state, render the
  scroll-spy panel menu from that type's section config, and do **one**
  `@switch (entityType)` to render the matching content component
  (`TermPageContent` / `GenePageContent` / `DiseasePageContent`).
- Each content component owns its own template and its own table columns
  explicitly — no generic column-type engine. A developer reading the
  disease content component sees exactly what disease renders.
- Each entity type's set of association sections is a small declarative
  config array (which sections exist, label, anchor, count). This is what
  "swap out sections" means concretely, and is treated as an intermediate
  step toward a more config-driven approach later, without committing to
  a full rendering engine now.
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
  `ReportEntryIssueButtonComponent` (disease-only).
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
