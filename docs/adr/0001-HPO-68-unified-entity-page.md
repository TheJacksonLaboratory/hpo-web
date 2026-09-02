# 0001 — Unified Entity Page (Phenotype / Gene / Disease)

## Status

Accepted (2026-08-31)

## Context

`hpo-web` renders phenotype, gene and disease detail pages as three independent,
near-duplicate components. Each hand-rolls its own Angular Material summary
card, tab group, and `MatTableDataSource` + `MatSort` + `MatPaginator` + filter
wiring. The duplication is concrete: identical CSS rules across all three, six
near-identical `applyXFilter` methods, identical download-dialog wiring and
export-button markup, and hardcoded `/browse/{type}/{id}` links repeated
throughout instead of a shared link builder.

The approved redesign gives all three entity types the same shape — a header, a
stack of association-table sections, and a sticky "On this page" panel that
scroll-spies between them, replacing today's tabs. Only the data differs per
type.

Tracked as **HPO-68**. HPO-173 (under the separate HPO-66 epic) covers
overlapping scope and is deliberately left open to be reconciled on the board,
per `docs/strategy/2026-08-12-redesign-direction.md`.

## Options considered

1. **Three routed components sharing extracted blocks.** Smallest change, but
   keeps three page shells to maintain and re-duplicates any future page-level
   concern.
2. **One config-driven rendering engine** — a generic component driven entirely
   by per-type typed column definitions. Maximum reuse, but per-type detail
   moves into config that reads worse than a template, and every future
   divergence puts pressure on the engine.
3. **One shell component with explicit per-type rendering underneath.** Chosen.

## Decision

One route target, one shell, explicit per-type content components.

- All three routes point at a single `EntityPageComponent`, distinguished by
  route `data.entityType` rather than by a URL segment.
- The shell stays thin: resolve the entity, hold loading and error state, own
  the page grid and both rails, and `@switch` once to the matching content
  component.
- Each type has a view model extending a common base (`kind`, `id`, `title`,
  `downloadCounts`), forming a discriminated union the shell reads without
  casts. **This buys readability, not safety** — the project sets neither
  `strict` nor `strictTemplates`, so switch exhaustiveness is not enforced.
- Each content component owns its template and declares its table columns
  explicitly. No generic column engine: a developer reading the disease content
  component sees exactly what disease renders.
- Table columns are supplied by content projection rather than a column config.
- Each type's section config — which sections exist, and their label, anchor and
  count — is a small declarative array living **beside that type's content
  component**, because the two must agree on every anchor and nothing enforces
  that at build time.
- **Missing data is expressed as absence from a type's section config, not as a
  permanent empty state.** Gene has no medical-action or assay fields, so gene
  omits those sections entirely; disease omits LOINC. A section that exists but
  happens to have no rows renders a genuine empty state.
  - Product-led exception: the phenotype page keeps **Examples** as a
    permanently-empty section, because the approved design carries it and its
    absence read as a gap. Revisit once Examples has a backing field.
- **Rollout is incremental: term → gene → disease**, each a shippable step that
  re-points only its own route. The other types keep their legacy components
  until their step, so a regression is contained to the route just migrated.

**Out of scope:** the Session History trail (HPO-43, a different epic); backend
DTO and provenance work (HPO-155). This targets the current `AnnotationService`
and `models.ts` shapes only.

## Consequences

- Three page directories collapse into one plus a shared block library,
  removing the duplicated filter, table and dialog wiring.
- Angular Material's table/tabs/form-field stack is dropped from these pages in
  favour of PrimeNG + Tailwind, matching the direction already set by
  `search-results`. `@angular/material` remains a dependency — the shared
  download dialog still uses `MatDialog`.
- Adding a section becomes a section-config change. Adding a genuinely new
  column layout still means writing that column's template in the relevant
  content component. That is the intended trade of choosing explicit rendering.
- **Content projection costs compile-time access to the table.** A projected
  header template is declared in the caller, where PrimeNG's `Table` is not an
  ancestor, so directives that inject it fail at runtime rather than at build —
  the header renders empty while the body populates. Sorting is offered through
  a select instead. An accepted cost of projection over a column config.
- **Empty sections sink below populated ones, and CSS `order` is visual only.**
  DOM order still follows the template, so a keyboard or screen-reader user
  meets an empty section in its canonical position rather than its visual one
  (WCAG 1.3.2 / 2.4.3). Fixing it means rendering sections from an ordered
  config with `@for`, which this decision otherwise avoids. Deferred, not
  resolved.
- Publications renders identifiers only; the design shows citation metadata that
  no current field supplies. Sourcing it is **HPO-200**.
- Per-type contribute links on empty sections are placeholders. **HPO-201**.
- Until the gene and disease steps ship, their legacy pages remain in place.
  This decision takes effect incrementally, not atomically.
