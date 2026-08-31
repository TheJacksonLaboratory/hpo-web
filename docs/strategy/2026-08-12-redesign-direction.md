# hpo.jax.org Redesign — Direction and Epic Structure

Status: agreed working document. Supersedes ad-hoc epic scoping in project HPO.

---

## Purpose

Two goals, not in tension: **keep traffic** (features, which sustains the funding
argument) and **stay canonical** (freshness, provenance, a dependable API, which sustains
the resource). This document records the direction, the rule that governs page content,
and how the existing HPO epics are restructured to serve both.

---

## Situation

**The threat is not competition.** dismech consumes `HP:` and produces no phenotype
annotations — 1,788 disorder files, created 2025-12-04. HPOA has 275,427 annotations
across 12,841 diseases using 11,489 distinct HP terms. dismech is downstream of HPO, not a
substitute for it. Monarch dropped MAXO in favour of NCIT (2026-07-31) but kept HP,
because HP has no competitor and MAXO competed with NCIT in NCIT's home territory.

**Phenopacket-native curation is a good destination, not a near-term replacement.**
phenopacket-store covers ~727 cohorts against 12,841 diseases (5.7%), releasing roughly
twice a year. HPOA's median disease carries 16 annotations; p25 is 7. That long tail will
never have cohorts, so literature-derived and phenopacket-derived annotations must coexist
indefinitely. The interim is the strategy.

**The real gaps are provenance and freshness.**

- Only ~107,865 of 275,427 annotations carry a PMID.
- `ontology-annotation-network` went untouched from 2026-02-11 while `hpo-web` shipped
  daily — the data layer decaying beneath an actively maintained front end.

**What decides obsolescence:** if HPOA rows stay unciteable while comparable resources
attach a PMID, a verbatim snippet, and an explanation to every claim, users will go
elsewhere to *understand* a phenotype and come here only to resolve an identifier.

---

## The editorial rule

> **Every page answers a question about phenotype data and its provenance. If a page would
> answer a question about disease biology or gene function, that is a link, not a page.**

Quote this into the scope section of every page epic. It is a decision procedure, not an
aspiration: when asked "should the disease page carry a clinical synopsis?", the answer is
derivable rather than re-argued.

**Why it exists.** A disease page that shows name, description, and associations reads as a
small OMIM page, and invites comparison with OMIM, Orphanet, Monarch, GeneReviews, and
dismech — all of which have more disease content and always will. Nobody publishes
annotation provenance. That is the defensible page.

| On the page | Linked out instead |
|---|---|
| Phenotype list with frequency, onset, sex | Clinical description → OMIM, Orphanet |
| Evidence code and source PMID per annotation | Mechanism, inheritance → dismech, GeneReviews |
| Provenance: manual curation vs ORPHA vs OMIM import | Management, treatment → GeneReviews |
| Annotation completeness — how many cited, last curated | Epidemiology → Orphanet |
| What changed since the last release | |

**One design, three entity types.** The redesign uses a single page layout for phenotype,
disease, and gene. `AnnotationController.all()` already dispatches on `SupportedEntity` and
returns `PhenotypeAnnotationDto` / `DiseaseAnnotationDto` / `GeneAnnotationDto`. With a
shared layout, the only thing distinguishing the three is **which content blocks are
populated** — which is exactly what this rule decides. The rule matters more under a shared
design, not less.

---

## Target architecture

**`ontology-service` — unchanged.** Canonical, generic, multi-ontology term API (hp, mondo,
cl, Babelon translations), parameterized to N Cloud Run deployments. Do not add
HPO-specific annotation content to it; its genericity is why other consumers use it. Do
not move to OLS: it addresses none of the annotation or content search problem, builds more
slowly, and serving our own ontology through another index reduces canonical standing.
`GraphService.getMostRecentTermId` already exists and is reused for term history.

**`ontology-annotation-network` — refactored off Neo4j.** The entire data layer is 358
lines across 12 queries. Eleven are single- or two-hop joins. One is a genuine graph
operation — `HAS_CHILD *0..` in `PhenotypeRepository` — a **static** ontology closure that
gets precomputed rather than traversed. Phenol already performs that traversal and is
already a dependency.

The target is the pattern `ontology-service` already proves: an embedded store built at
release time, no database server, deployed as a stateless container. The ETL emits a
checksummed artifact; deployment ships a file and rollback ships the previous one. This
also removes the manual ETL that gates every correction behind a release.

**Search is its own service, reading release files.** Not an endpoint added to either
existing service.

The problem search creates is that ranking is impossible across two result sets — you
cannot decide whether "seizure" should return the HP term, the disease, or the gene when
candidates arrive from separate APIs. That forces one index over all types. But putting
that index in either existing service is wrong:

- **In OAN** — OAN would have to expose terms and synonyms, at which point it is the HPO
  API rather than the annotation network. That also re-merges a split that was made
  deliberately: this *was* a single service and was separated on purpose. Undoing that
  without recovering the original reasoning is a bad trade.
- **In `ontology-service`** — it is generic and deployed once per ontology. HPO-specific
  annotation content does not belong in it, and adding it forfeits the genericity that
  makes it useful to other consumers.

So a third, small service owns search. It reads `hp-base.json` (terms **and synonyms**),
`phenotype.hpoa`, and the gene files, builds one index, and exposes a single ranked,
faceted, typed endpoint. It depends on neither service at runtime — only on the release
files.

Why this is the right shape:

- **It breaks no existing contract.** Both current APIs keep serving exactly what their
  consumers expect today. Search is additive.
- Search is the only component needing cross-type knowledge, so isolating it avoids forcing
  a foreign responsibility into either existing service.
- It is the smallest possible service: one read-only endpoint over a prebuilt index, no
  writes, no domain logic, same stateless baked-in-artifact pattern as the others.
- An index built from canonical release files cannot drift from the release; one built from
  a serving database can.
- Search does **not** depend on the OAN refactor, so it can proceed independently.

**Payload shape matters.** Search returns ids plus only what a result row needs — name,
type, category. Detail is fetched from whichever API owns it on click-through. That is
navigation, not fan-out on the hot path.

### One API surface already exists

A third service does not mean a third base URL. Both existing services are already
path-namespaced under one host, `ontology.jax.org`:

| Path | Service | Source of the prefix |
|---|---|---|
| `/api/hp/terms/{id}` | `ontology-service` | `/${api-url.prefix}/${ontology}`, `ontology: hp` |
| `/api/hp/terms?filter=` | `ontology-service` | |
| `/api/hp/search?q=` | `ontology-service` | term search — **matches synonyms** |
| `/api/network/annotation/{id}` | OAN | `context-path: /api/network` |
| `/api/network/annotation/{id}/download/{type}` | OAN | |
| `/api/network/search/{entity}?q=` | OAN | disease/gene search — **no synonyms** |
| `/api/network/search/{entity}/intersect?p=` | OAN | |
| `/api/hp/docs`, `/api/network/docs` | both | two separate Swagger UIs |

So there is **no gateway to build**. A search service is a third path segment — `/api/search`
— which is currently free and follows the existing convention. Because `ontology-service` is
parameterized by `${ontology}`, `/api/mondo/*` and `/api/cl/*` are the same codebase at other
paths, which is the concrete reason it must stay generic.

Two facts this structure makes plain:

1. **Two search endpoints already exist**, which is the ranking problem in the flesh.
   `/api/hp/search` returns terms with synonym matching; `/api/network/search/{entity}`
   returns diseases and genes without. No client can rank one against the other.
2. **Two OpenAPI documents already exist.** A single documented surface is therefore new
   work regardless of how many services there are — it is not an argument for or against
   this split.

**Compatibility path.** `/api/search?q=` (unified) and `/api/network/search/{entity}?q=`
(legacy, per-type) are distinguishable by path and can coexist, so existing consumers keep
working while the unified endpoint becomes the recommended one. Deprecate the legacy path on
a schedule rather than breaking it.

**Synonyms are not optional.** OAN's current search matches `name` and `id` only;
`ontology-service`'s covers "ontology term, id, synonym." Most usable HPO search *is*
synonyms — clinicians type "big toe," not "hallux." An index without them would be worse
than what exists today for the term half of the results. They are already available in
`hp-base.json`, which the ETL loads via `OntologyLoader`, but this must be in the index
design from the start rather than added later.

**Precompute at build time.** Because the corpus is static between HPO releases —
propagated phenotype→disease closure, co-occurrence, release-to-release term diffs, and the
search index. This is what collapses serving requirements to key lookups and index seeks.

---

## Epic restructuring

### The problem with the current structure

Epics were sliced by **screen and by discipline**, not by outcome. `Search - UX` /
`Search - Technology` / `Search - Agentic Exploration` is one capability split three ways by
job function; the UX cannot ship without the technology, so no epic is independently
deliverable. `Content Views - UI Layout` / `Associations` / `Summaries` / `Linkouts` is four
epics that must all land before one page works.

The consequence is a **design-then-implement waterfall**: `Home Page - UI Layout`,
`Content Views - UI Layout`, `Tools - UI Layout`, and `Search - UX` are all design epics.
Design completes across all of them, then implementation arrives as an undifferentiated pile
with no epic of its own.

**No epic covered data.** Twenty-one epics and not one addressed the OAN, provenance, the
ETL, or the artifact. That is the same pattern visible in the commit history, where
`hpo-web` shipped daily and the OAN sat for six months. The backlog structure produced the
outcome.

Fix: **vertical slices.** One epic ships one coherent outcome, with design and
implementation inside it.

### Migration table

| Key | Current summary | Decision |
|---|---|---|
| HPO-1 | Home Page - UI Layout | Done — no action |
| HPO-2 | Home Page | Done — no action |
| HPO-31 | Home Page - Change Log | **Rescope** → term history and release diff: merges, obsoletions, relabels, and what they imply for existing annotations. Expands beyond a home-page widget. Requires zero curation. |
| HPO-42 | Site Navigation - Analytics | **Rescope** → instrumentation: term-level view/click capture plus a top-terms report. Prioritization input for content investment. |
| HPO-43 | Site Navigation - IA | **Fold into HPO-66** — this is the breadcrumb history component from the design, not site-wide IA. |
| HPO-54 | Search - Agentic Exploration | **Park** with the Tools group. |
| HPO-55 | Search - UX | **Leave as-is for now** (In Progress). |
| HPO-56 | Search - Technology | **Close — superseded by HPO-176** (`hpo-search`). Its scoping question ("HPO-specific or general?") is answered there: HPO-specific for now, generic later if wanted. Now childless: HPO-100 moved to HPO-176; HPO-101 and HPO-102 closed as Won't Do (never scoped, and they assumed vector search where HPO-176 commits to lexical BM25). |
| HPO-62 | Content Views - Agentic Exploration | **No change.** |
| HPO-63 | Content Views - Associations | **Fold into HPO-66.** |
| HPO-64 | Content Views - Summaries | **Close** — part of HPO-66 implementation. Illustration/image curation extracted to its own epic. |
| HPO-65 | Content Views - Linkouts | **Close** — tool linkouts are a story, not an epic. |
| HPO-66 | Content Views - UI Layout | **Rename → "Entity Pages — Design & Build."** Absorbs HPO-43 and HPO-63. Keep in-flight stories untouched; add two new stories: (1) build the shared page with all blocks, (2) wire the three DTOs into it. Drops the "not included: backend" exclusion that created the handoff. |
| HPO-83 | Tools - Phenotype Profile | **Fold into HPO-85.** |
| HPO-84 | Tools - Results View | **Fold into HPO-85.** |
| HPO-85 | Tools - Tool Implementation | **Survives as umbrella, rename → "Tools."** Absorbs 83, 84, 86, 87 as stories. |
| HPO-86 | Tools - Authentication and Cost | **Fold into HPO-85.** |
| HPO-87 | Tools - UI Layout | **Fold into HPO-85.** |
| HPO-91 | HPO UI | **Keep for now** — design system, theming, WCAG 2.2. |
| HPO-126 | Mangement and Operations | **Keep** — houses PI-originated work outside the main workstream. Fix the summary typo. |
| HPO-139 | Leftover | **Keep, rescope** as an explicit release-readiness epic that closes when the release ships. |

### New epics

Created 2026-08-12. Renames, rescopes, and closures in the table above are **not yet
applied** — they remain a second pass.

| Epic / issue | Key | Stories | Status |
|---|---|---|---|
| OAN off Neo4j to a build artifact | **HPO-154** | HPO-157 … HPO-168 | HPO-157 done |
| Annotations carry their evidence | **HPO-155** | HPO-169 … HPO-172 | To Do |
| Volunteer illustration campaign | **HPO-156** | none | **Parked**, labelled |
| `hpo-search` — unified search and faceting | **HPO-176** | HPO-100, HPO-177 … HPO-181 | **In Progress** |
| Bug: negated `NOT` annotations served as positive | **HPO-175** | — | To Do, standalone |
| Entity Pages (existing) | HPO-66 | HPO-173, HPO-174 added | In Progress |
| API as a Product | HPO-182 | — | **Won't Do** — descoped |

**HPO-176 supersedes HPO-56.** A third service at `/api/search`, using **DuckDB** rather
than SQLite: query-dependent facet counts ("of the results matching *seizure*, how many are
autosomal dominant?") cannot be precomputed, which makes faceted search a columnar workload.
SQLite remains OAN's store and the interchange format — DuckDB reads it natively.

**HPO-182 was descoped.** A unified OpenAPI document across paths is not planned. The only
dependent piece — the deprecation process for `/api/network/search/{entity}` — is covered by
HPO-181. Consequence: `/api/hp/docs` and `/api/network/docs` stay separate and `hpo-search`
adds a third. That is the status quo, not a regression.

**Known overlap:** HPO-173 ("Build the shared entity page with all content blocks")
duplicates the pre-existing HPO-68 ("Implement Redesigned Content Views Layout in UI").
Both left open deliberately; to be reconciled on the board. Likewise HPO-100 ("Search
Research") overlaps HPO-177 (the DuckDB spike) — also kept separate deliberately, though
HPO-100's criteria still specify "a vector or score based metric" where HPO-176 commits to
lexical BM25.

**Note on HPO-66's existing stories:** they run
`Review IA → Implement → Accessibility Audit → User Testing → Refine` — the same
design-then-implement waterfall this document argues against, reproduced at story level.
Left as-is because the work is in flight.

**OAN off Neo4j to a build artifact** — one epic, 12 stories: target schema and FTS choice
· ETL emits artifact (replacing `GraphDatabaseWriter` / `GraphDatabaseOperations`) ·
precompute propagated `phenotype_disease` closure · port `DiseaseRepository` (4 queries) ·
port `GeneRepository` (3) · port `PhenotypeRepository` (4, incl. closure lookup) · FTS
replaces `toLower(name) =~ $regex` · port the three repository tests to a fixture artifact ·
run the SQLite build at a second URL and diff it live against Neo4j · strip
`micronaut-neo4j-bolt` and `neo4j-harness` · CI build-on-release mirroring
`ontology-check-trigger.yml` / `ontology-build-deploy.yml` / `ontology-sanity.yml` ·
publish the artifact as a download (**HPO-168 — recommended descope**, see open items).

Three of these were rescoped after reading the code and the deploy workflows:

* **HPO-158** removes the Neo4j implementation outright rather than abstracting over it.
  `GraphWriter.write(Collection<org.neo4j.driver.Query>)` takes Neo4j types, so there is no
  seam to reimplement — the Cypher is inline across ten loader methods.
* **HPO-165** became a live two-URL diff rather than a frozen response corpus, because both
  services run in parallel before cutover.
* **HPO-166** is now mostly infrastructure teardown: the `graph-data` persistent disk, the
  `ontology-annotation-loader` VM, the `ontology-annotation-network-containerized` VM, the
  GCS bucket, and `network-data-reattach-only.yml`. Gated on a successful release through
  HPO-167.

**Annotations carry their evidence** — its own epic, deliberately **not** inside the OAN
epic. Two reasons: it would break the equivalence harness, since that harness depends on the
migration being behaviour-preserving and this deliberately changes the payload; and it would
block time-sensitive work behind slow work, since provenance can ship on the current stack
while the redesign is open.

Current state: `PhenotypeMetadata` is `(String sex, String onset, String frequency,
List<String> sources)` — untyped strings. `Evidence` (`TAS`, `PCS`, `IEA`) exists in the
model but never reaches the payload. No model field is named pmid/reference/citation.

Stories: typed reference model + evidence code in payload + ETL carries both from
`phenotype.hpoa` · render provenance on the phenotype view · render on the disease view ·
annotation health summary (% PMID-backed, last curated, conspicuous gaps).

**Volunteer illustration campaign** — its own epic, **parked**. Strategically strong because
an illustrator needs no curation authority, so it is the one contribution channel that does
not route through the PI. Parked until two questions are answered: a **medical accuracy
review gate** that does not reintroduce the curator bottleneck it exists to bypass, and
**license and ownership** (CC-BY, held by whom).

Loop once unparked: analytics picks top terms → campaign illustrates them → co-occurrence
identifies confused pairs → disambiguation text drafted → illustration plus text becomes the
differentiated page.

---

## Deferred, recorded not cut

Phenopacket display/export (scope before committing — export is cheap and aligns with the
phenopacket direction; a similarity/beacon UI is the commodity lane) · text mining (wrap
ClinPhen, txt2hpo, PhenoTagger, or FastHPOCR; do not build one) · agent-drafted phenotype
composites (requires provenance display and a review gate first) · variant interpretation
(link out to Exomiser and LIRICAL; building it competes with our own tools plus Franklin,
Varsome, Emedgene, Fabric) · cell type distribution in organs (Uberon/CL, HuBMAP,
CellxGene).

**Freeze candidate:** the phenopacket similarity / vector-sim / beacon lane is unwinnable
against Exomiser, Phenomizer, Monarch semsim, GestaltMatcher, and Matchmaker Exchange, and
carries the heaviest workload markers on the ecosystem diagram. Verify ownership before
acting — the diagram attributes PhenopacketBeaconAPI to Mike, PhenopacketVectorSimAPI to
Peter Hansen, BOQA to Leo. Keep the phenopacket *store*; repoint it from similarity to
usage evidence on term pages.

---

## Sequencing

No prerequisites: instrumentation (HPO-42) · provenance (HPO-155) · term history (HPO-31) ·
OAN artifact (HPO-154) · the `NOT` bug (HPO-175).

Dependent: Entity Pages (HPO-66) needs provenance and search · illustrations (HPO-156) need
instrumentation · **`hpo-search` (HPO-176) needs the OAN artifact (HPO-154)**.

**Correction from an earlier draft:** search is *not* independent of the OAN refactor. It
would be only if `hpo-search` re-parsed `phenotype.hpoa` itself, which duplicates
non-trivial normalization (`HpoaDiseaseDataLoader`, frequency formatting, MONDO matching) —
the same mistake avoided for terms by consuming `ontology-service` rather than re-parsing
`hp.json`. Applying the one-authority-per-fact rule consistently costs search its
independence. The research and spike stories (HPO-100, HPO-177) can still proceed now.

### Decided order

**HPO-154 (OAN artifact) → HPO-155 (provenance) → HPO-175 (the `NOT` bug).** HPO-42
(instrumentation) is small and unblocked, so it slots in wherever convenient.

**Rationale.** Provenance changes the ETL and the model. Doing it *after* the migration
means touching both **once**, in the SQLite world, rather than implementing against Neo4j
and porting during HPO-154. It also keeps HPO-154's equivalence diff clean, since that epic
is deliberately behaviour-preserving.

**The trade being accepted.** HPO-66 (Entity Pages) is already In Progress. With provenance
behind the full OAN migration, the redesign will likely ship before it, so the provenance UI
becomes a retrofit into settled files rather than work done while already in them. The
earlier draft argued for provenance first on exactly this "cheapest moment" basis; the
do-it-once argument was judged stronger.

Two epics are In Progress and both block on work that has not started: HPO-66 needs HPO-155
to have provenance to render, and HPO-176 needs HPO-154's artifact before its build stories
can proceed. HPO-176's research and spike (HPO-100, HPO-177) are the exception and can run
now.

**Parked until the current release ships, then reassessed together:** HPO-54, HPO-62,
HPO-85 (Tools), HPO-156 (illustrations).

**Deployment:** the SQLite build stands up at a second URL alongside the existing Neo4j
service; both run in parallel and are diffed live (HPO-165) until cut over. Infrastructure
is decommissioned only after that (HPO-166).

---

## Open items

1. **Ordering** — foundation first or visible value first. Not yet decided; the only
   decision that shapes the rest.
2. **HPO-168** — publish the artifact as a downloadable release asset. Its rationale was
   external distribution, which does not apply: nothing outside the service consumes the
   artifact, and CI bakes it into the container image. Recommend descope; not yet actioned.
3. **Illustration review gate and licensing** — blocks unparking HPO-156. Needs a review
   path that is not the PI, or the epic stays parked.
4. **Phenopacket lane ownership** — confirm what routes back to us operationally before
   freezing anything.
5. **HPO-100's vector scope** — its acceptance criteria specify "a vector or score based
   metric" while HPO-176 commits to lexical BM25. Kept separate deliberately, but the two
   will contradict when HPO-100 is picked up.

### Resolved since first draft

* **Store for OAN** — SQLite, ETL at build time, baked into the container image. Decided in
  HPO-157; the deciding evidence was the ~4-minute data load, which cannot become a Cloud
  Run cold start.
* **Store for `hpo-search`** — DuckDB. Not primarily a facet-count performance need — at
  this corpus size (275,427 annotations) SQLite would handle query-dependent facet counts
  fine too. The real case is that DuckDB doubles as a general analytics engine the
  ecosystem already wants (HPO-42's top-terms report, HPO-155's annotation-health summary,
  co-occurrence for HPO-156's illustration loop), and it can query Parquet/JSON release
  files directly without an explicit load step.
* **HPO-55 / HPO-56** — HPO-56 is superseded by HPO-176 and closes; HPO-55 continues as-is.
* **Metadata from the HPOA `aspect` column** — deferred, to be groomed later. The
  correctness half is tracked as HPO-175.
