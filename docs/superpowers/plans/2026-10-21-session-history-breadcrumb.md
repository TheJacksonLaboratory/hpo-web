# Session History Breadcrumb Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Track the term, gene and disease pages visited in a browser tab and show them as a clickable trail in the entity page's "Session History" slot.

**Architecture:** Pure trail functions hold every rule (append, rewind, cap, collapse). A root-provided service owns the trail signal, sessionStorage persistence, and the router context that decides which rule applies. A presentational component renders the trail from the service and replaces `SessionPlaceholderComponent`. `EntityPageComponent` reports each resolved entity to the service.

**Tech Stack:** Angular 20 standalone components and signals, Angular Router, Tailwind (unprefixed in this repo's templates, matching `id-badge.component.html`), PrimeIcons, Jest + jest-preset-angular.

**Spec:** `docs/superpowers/specs/2026-10-21-session-history-breadcrumb-design.md`

**Branch:** `HPO-183-breadcrumb-history-component` (name from the user; base branch to be confirmed, see handoff).

## Global Constraints

- Only phenotype, gene and disease pages are steps (`EntityType.PHENOTYPE | GENE | DISEASE`, routes `term/:id`, `gene/:id`, `disease/:id`).
- Trail lives in sessionStorage per tab; storage access is wrapped in try/catch and degrades to in-memory.
- Stored cap: 50 steps. Display: the six most recent steps behind a leading "..." when more exist.
- Duplicate consecutive steps (same `entityType` and `id`) are never stored.
- A step is recorded only after its entity resolves, using the view model's `id` and `title`.
- Steps link to the bare `term/:id`, `gene/:id`, `disease/:id` routes.
- The last step is plain text with `aria-current="page"`; no trailing chevron.
- Comments are TSDoc only. Load the `code-documentation` skill before writing any new function, class or component.
- Run `npm run test:ci` and `npm run lint` before each commit; commits follow the repo's `HPO-183: ...` style.

## Review Focus

- Reload on an entity page: trail unchanged, no duplicate step.
- Typed URL or bookmark to a different entity in a tab that has a trail: starts a new trail.
- Entity opened from search or home: starts a new trail; the old trail is gone.
- Rewind click, then Back to a page the rewind dropped: appended, trail ends at the page on screen.
- Trail holding the same entity twice (`A > B > A > C`), Back to A: cut to the most recent A.
- Resolve error, or a click-through superseded by a second navigation: no step recorded.
- sessionStorage unavailable or holding malformed JSON: trail works in memory, no throw.

---

### Task 1: Pure trail functions

**Files:**
- Create: `src/app/browser/services/session-history/session-history.types.ts`
- Create: `src/app/browser/services/session-history/session-history.trail.ts`
- Test: `src/app/browser/services/session-history/session-history.trail.spec.ts`

**Interfaces:**
- Produces:
  - `interface SessionStep { entityType: EntityType; id: string; label: string }`
  - `const MAX_STORED_STEPS = 50`, `const MAX_VISIBLE_STEPS = 6`
  - `appendStep(trail: SessionStep[], step: SessionStep): SessionStep[]` - no-op when the last step has the same `entityType` and `id`; drops the oldest steps beyond `MAX_STORED_STEPS`.
  - `rewindToIndex(trail: SessionStep[], index: number): SessionStep[]` - keeps steps `0..index`.
  - `rewindToEntity(trail: SessionStep[], step: SessionStep): SessionStep[]` - cuts to the most recent matching step, or appends `step` when none matches.
  - `startTrail(step: SessionStep): SessionStep[]`
  - `visibleSteps(trail: SessionStep[]): { hasHidden: boolean; steps: { step: SessionStep; index: number }[] }` - the last `MAX_VISIBLE_STEPS`, each with its index in the full trail so click handlers rewind correctly.
  - `stepRoute(step: SessionStep): string[]` - e.g. `['/term', 'HP:0001250']`.

- [ ] **Step 1: Write failing tests** named: `appendStep adds a different entity`, `appendStep ignores the same entity twice in a row`, `appendStep keeps a repeated entity that is not consecutive`, `appendStep drops the oldest step past 50`, `rewindToIndex keeps steps up to and including the index`, `rewindToEntity cuts to the most recent occurrence of a repeated entity`, `rewindToEntity appends when the entity is not in the trail`, `visibleSteps returns all steps with hasHidden false at six or fewer`, `visibleSteps returns the last six with original indexes and hasHidden true`, `stepRoute maps each EntityType to term/gene/disease`. Use the spec's example trail `Hypertension > PTBP1 > Labile Hypertension`.
- [ ] **Step 2: Run** `npx jest session-history.trail` - expect FAIL (module not found).
- [ ] **Step 3: Implement** the signatures above in `session-history.trail.ts`; types in `session-history.types.ts`. No Angular imports; functions never mutate their input.
- [ ] **Step 4: Run** `npx jest session-history.trail` - expect PASS.
- [ ] **Step 5: Commit** `HPO-183: add pure session trail functions`.

---

### Task 2: Session history service

**Files:**
- Create: `src/app/browser/services/session-history/session-history.service.ts`
- Test: `src/app/browser/services/session-history/session-history.service.spec.ts`

**Interfaces:**
- Consumes: everything produced by Task 1; Angular `Router`.
- Produces: `@Injectable({ providedIn: 'root' }) class SessionHistoryService` with
  - `readonly steps: Signal<SessionStep[]>` - the stored trail.
  - `record(step: SessionStep): void` - called by the entity page after each successful resolve; applies the first matching rule below.
  - `rewindTo(index: number): void` - cuts the trail with `rewindToIndex`, marks the pending navigation as a rewind, and navigates to `stepRoute` of the clicked step.

**`record` rules, in order** (context captured from `NavigationStart`/`NavigationEnd`; the previous URL is `router.url` at `NavigationStart`):
1. Pending navigation was a rewind from `rewindTo`: trail already cut, change nothing.
2. Last step equals `step` (reload or same page): change nothing.
3. Navigation trigger is `popstate` (Back/Forward): `rewindToEntity`.
4. Previous URL is an entity route (`/term/`, `/gene/`, `/disease/`): `appendStep`.
5. Otherwise (first load, search, home, static page, typed URL): `startTrail`.

Persist after every change under one sessionStorage key; hydrate in the constructor, discarding anything that fails validation (not an array of `{entityType, id, label}`).

- [ ] **Step 1: Write failing tests** (use `Router` test doubles that emit `NavigationStart`/`NavigationEnd` and a stubbed `sessionStorage`): `starts a trail on the first record`, `appends when the previous URL is an entity page`, `starts a new trail when the previous URL is search`, `starts a new trail when a different entity is loaded with no previous URL`, `does nothing when the same entity is recorded again`, `rewindTo cuts the trail and navigates to the clicked step`, `rewindTo then record of the same step does not append`, `popstate to an entity in the trail cuts to its most recent occurrence`, `popstate to an entity not in the trail appends it`, `hydrates a stored trail`, `ignores malformed stored JSON`, `works when sessionStorage throws`.
- [ ] **Step 2: Run** `npx jest session-history.service` - expect FAIL.
- [ ] **Step 3: Implement** `SessionHistoryService` per the rules; storage reads and writes in a small private helper that catches errors.
- [ ] **Step 4: Run** `npx jest session-history` - expect PASS.
- [ ] **Step 5: Commit** `HPO-183: add session history service`.

---

### Task 3: Breadcrumb component and entity page wiring

**Files:**
- Create: `src/app/browser/components/session/session-history.component.ts`
- Create: `src/app/browser/components/session/session-history.component.html`
- Create: `src/assets/session-history/` (type icons and chevron downloaded from Figma, see Step 1)
- Modify: `src/app/browser/pages/entity/entity-page.component.ts` (import, call `record` in the resolve `next` handler at the `this.viewModel = viewModel` block)
- Modify: `src/app/browser/pages/entity/entity-page.component.html:6` (replace `<app-session-placeholder ...>` with `<app-session-history />`)
- Delete: `src/app/browser/components/session/session-placeholder.component.ts` and `.html`
- Test: `src/app/browser/components/session/session-history.component.spec.ts`; a case in a new `src/app/browser/pages/entity/entity-page.component.spec.ts`

**Interfaces:**
- Consumes: `SessionHistoryService.steps`, `SessionHistoryService.rewindTo(index)`, `visibleSteps`, `stepRoute`.
- Produces: `app-session-history` (standalone, no inputs).

- [ ] **Step 1: Get the icons.** Load the `figma-design-to-code` skill, then call `get_design_context` on Figma file `YS0wExLoH5cGTYMviEnIjw` nodes `315:3329`, `315:3331` and `315:3335` (the three item types) and `315:3330` (chevron), and save the returned assets to `src/assets/session-history/` as the skill directs. Map the three icons to `EntityType` by comparing with the screenshot (target = phenotype term, virus = disease, DNA = gene). Download the frame screenshot (`315:3323`) as the visual target.
- [ ] **Step 2: Write failing component tests:** `renders a nav landmark labelled "Session History"`, `renders every step as a link except the last`, `renders the last step as plain text with aria-current page`, `shows the ellipsis and only the six most recent steps for a longer trail`, `renders no trailing chevron`, `clicking an earlier step calls rewindTo with its full-trail index and prevents the default navigation`, `renders nothing visible but the label for an empty trail`. Entity page spec: `reports the resolved view model's type, id and title to the session history service`, `does not report anything when the resolve errors`.
- [ ] **Step 3: Run** `npx jest session-history.component entity-page.component` - expect FAIL.
- [ ] **Step 4: Implement** the component to match the Figma frame (light-blue band, small "Session History" label, one row of steps, 16px icons, brand-blue bold links, chevron separators); semantics are `nav > ol > li`. Add `SessionHistoryService.record({ entityType: viewModel.kind, id: viewModel.id, label: viewModel.title })` in `EntityPageComponent`'s resolve `next` handler, before `loading = false`. Remove the placeholder component and its import.
- [ ] **Step 5: Run** `npm run test:ci` and `npm run lint` - expect all PASS.
- [ ] **Step 6: Commit** `HPO-183: replace session placeholder with breadcrumb trail`.

---

### Task 4: Verify in the running app

**Files:** none.

- [ ] **Step 1: Load the `run` skill and start the app.** Walk this script and confirm each result: open a disease page -> follow a gene link -> follow a phenotype link (trail has three steps); click the first step (trail cuts to one); follow a link (appends); reload (unchanged); use browser Back (trail matches the page); run a search and open a result (new trail); open a new tab with a pasted entity URL (empty trail plus that one step).
- [ ] **Step 2: Compare** the rendered row to the Figma screenshot at desktop and phone width; report any mismatch rather than altering unrelated styling.
